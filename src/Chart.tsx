import * as React from "react";
import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";

type HistoryItem = {
    time: number;
    value: number;
};

type HistoryApiResult = HistoryItem[];

type PriceApiResult = {
    result: {
        XXBTZUSD: [
            // Time
            number,
            // Price
            number
        ][];
    };
};

type Point = { x: number; y: number };
type ChartData = {
    xAxis: { min: number; max: number };
    appIndex: Point[];
    btcPrice: Point[];
};

export const Chart = () => {
    const [chartData, setChartData] = useState<ChartData>({
        xAxis: { min: 0, max: 1 },
        appIndex: [],
        btcPrice: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            const [historyApiResponse, priceApiResponse] = await Promise.all([
                fetch("/api/history"),
                fetch(
                    "https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=60"
                ),
            ]);
            const historyData: HistoryApiResult =
                await historyApiResponse.json();
            const priceData: PriceApiResult = await priceApiResponse.json();
            const appIndex = historyData.map((item) => ({
                x: item.time,
                y: item.value * 100,
            }));
            const btcPrice = priceData.result.XXBTZUSD.map((ohlc) => ({
                x: ohlc[0],
                y: ohlc[1],
            }));
            const xAxis = {
                min: btcPrice[0].x - 10_000,
                max: btcPrice[btcPrice.length - 1].x + 10_000,
            };
            setChartData({ appIndex, btcPrice, xAxis });
        };
        fetchData();
    }, []);

    return (
        <Scatter
            data={{
                datasets: [
                    {
                        label: "App Ranking Index",
                        yAxisID: "appRankingIndexScale",
                        showLine: true,
                        data: chartData.appIndex,
                        borderColor: "#36a2eb",
                        backgroundColor: "#36a2eb",
                    },
                    {
                        label: "Bitcoin Price (USD)",
                        yAxisID: "btcScale",
                        showLine: true,
                        data: chartData.btcPrice,
                        borderColor: "#FF9900",
                        backgroundColor: "#FF9900",
                    },
                ],
            }}
            options={{
                elements: {
                    point: {
                        pointStyle: false,
                    },
                    line: {
                        cubicInterpolationMode: "monotone",
                        tension: 0.4,
                    },
                },
                scales: {
                    x: {
                        min: chartData.xAxis.min,
                        max: chartData.xAxis.max,
                        ticks: {
                            color: "#eeeeee",
                            callback: (time) => {
                                if (typeof time !== "number") {
                                    return "";
                                }

                                return new Date(time * 1000).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                    }
                                );
                            },
                        },
                        grid: {
                            color: "#343434",
                        },
                    },
                    appRankingIndexScale: {
                        axis: "y",
                        position: "left",
                        min: 0,
                        max: 100,
                        ticks: {
                            color: "#36a2eb",
                        },
                        grid: {
                            color: "#343434",
                        },
                    },
                    btcScale: {
                        axis: "y",
                        position: "right",
                        ticks: {
                            color: "#FF9900",
                            callback: (price) => {
                                if (typeof price !== "number") {
                                    return "";
                                }

                                return usdFormatter.format(price);
                            },
                        },
                        grid: {
                            color: "#343434",
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#eeeeee",
                        },
                    },
                    zoom: {
                        limits: {
                            x: {
                                min: chartData.xAxis.min,
                                max: chartData.xAxis.max,
                            },
                        },
                        zoom: {
                            mode: "x",
                            wheel: {
                                enabled: true,
                                speed: 0.025,
                            },
                        },
                        pan: {
                            mode: "x",
                            enabled: true,
                        },
                    },
                    tooltip: {
                        mode: "x",
                        intersect: false,
                        callbacks: {
                            title: (items) => {
                                const [item] = items;
                                const time = item.parsed.x;

                                let foundIndexItem = false;
                                let foundPriceItem = false;
                                items.forEach((item) => {
                                    if (item.datasetIndex === 0) {
                                        if (foundIndexItem) {
                                            //@ts-ignore
                                            item.skip = true;
                                        }
                                        foundIndexItem = true;
                                    } else if (item.datasetIndex === 1) {
                                        if (foundPriceItem) {
                                            //@ts-ignore
                                            item.skip = true;
                                        }
                                        foundPriceItem = true;
                                    }
                                });

                                return new Date(time * 1000).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        hour12: true,
                                        hour: "numeric",
                                        minute: "2-digit",
                                    }
                                );
                            },
                            label: (item) => {
                                //@ts-ignore
                                if (item.skip) {
                                    // Allow only the first item for each dataset to appear on the tooltip.
                                    return "";
                                }

                                if (item.datasetIndex === 0) {
                                    return item.parsed.y.toFixed(0);
                                } else {
                                    return usdFormatter.format(item.parsed.y);
                                }
                            },
                        },
                    },
                },
            }}
        />
    );
};

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});
