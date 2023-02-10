import { Decimation } from "chart.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";

type ChartData = {
    labels: string[];
    customData: number[];
    btcData: number[];
};

export const Chart = () => {
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        customData: [],
        btcData: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            const [customResponse, btcResponse] = await Promise.all([
                fetch("/api/history"),
                fetch(
                    "https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=60"
                ),
            ]);
            const customData = await customResponse.json();
            const btcData = await btcResponse.json();
            const customValues = customData.map((d: any) => ({
                x: d.time,
                y: d.value * 100,
            }));
            const labels: string[] = [];
            // const btcPrices: number[] = [];
            const btcPrices = btcData.result.XXBTZUSD.map(
                (d: [number, number]) => ({
                    x: d[0],
                    y: d[1],
                })
            );
            setChartData({
                labels: labels,
                customData: customValues,
                btcData: btcPrices,
            });
        };
        fetchData();
    }, []);

    return (
        <Scatter
            plugins={[Decimation]}
            data={{
                // labels: chartData.labels,
                datasets: [
                    {
                        label: "App Ranking Index",
                        yAxisID: "appRankingIndexScale",
                        showLine: true,
                        data: chartData.customData,
                        borderColor: "#36a2eb",
                        backgroundColor: "#36a2eb",
                    },
                    {
                        label: "Bitcoin Price (USD)",
                        yAxisID: "btcScale",
                        showLine: true,
                        data: chartData.btcData,
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
                        ticks: {
                            color: "#eeeeee",
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
                },
            }}
        />
    );
};
