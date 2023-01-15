import * as React from "react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

type ChartData = {
    labels: string[];
    customData: number[];
    btcData: number[];
};

const fetchHistory = () => {
    return Promise.resolve([
        { time: 1673299078, value: 0.15987706 },
        { time: 1673299162, value: 0.15987706 },
        { time: 1673300652, value: 0.16013741 },
        { time: 1673471024, value: 0.1176052 },
        { time: 1673471713, value: 0.11687469 },
        { time: 1673474441, value: 0.10285382 },
        { time: 1673478045, value: 0.10297017 },
        { time: 1673481646, value: 0.10238232 },
        { time: 1673485241, value: 0.10243625 },
        { time: 1673488844, value: 0.09645869 },
        { time: 1673492440, value: 0.09654741 },
        { time: 1673496040, value: 0.08547277 },
        { time: 1673499640, value: 0.08547815 },
        { time: 1673503242, value: 0.08545178 },
        { time: 1673506845, value: 0.08741641 },
        { time: 1673510445, value: 0.08729807 },
        { time: 1673514043, value: 0.08684956 },
        { time: 1673517644, value: 0.10041485 },
        { time: 1673521246, value: 0.10080009 },
        { time: 1673524841, value: 0.10090843 },
        { time: 1673528442, value: 0.126319 },
        { time: 1673532044, value: 0.1249979 },
        { time: 1673535643, value: 0.12540241 },
        { time: 1673539241, value: 0.12502792 },
        { time: 1673542844, value: 0.12518137 },
        { time: 1673546445, value: 0.1251615 },
        { time: 1673550043, value: 0.12306445 },
        { time: 1673553643, value: 0.12282298 },
        { time: 1673557240, value: 0.12302476 },
        { time: 1673560842, value: 0.11333726 },
        { time: 1673564444, value: 0.11332004 },
        { time: 1673568045, value: 0.11337161 },
        { time: 1673571643, value: 0.10131957 },
        { time: 1673575240, value: 0.10152451 },
        { time: 1673578842, value: 0.10124977 },
        { time: 1673582442, value: 0.08707271 },
        { time: 1673586045, value: 0.08718683 },
        { time: 1673589639, value: 0.08706962 },
        { time: 1673593245, value: 0.08875742 },
        { time: 1673596844, value: 0.08875297 },
        { time: 1673600440, value: 0.08900223 },
        { time: 1673604049, value: 0.10885095 },
        { time: 1673607648, value: 0.10924907 },
        { time: 1673611247, value: 0.10933963 },
        { time: 1673614844, value: 0.14571109 },
        { time: 1673618446, value: 0.14627459 },
        { time: 1673622045, value: 0.14620278 },
        { time: 1673625644, value: 0.15015951 },
        { time: 1673629247, value: 0.14994594 },
        { time: 1673632851, value: 0.1504437 },
        { time: 1673636442, value: 0.15011783 },
        { time: 1673640043, value: 0.1503999 },
        { time: 1673643643, value: 0.15064951 },
        { time: 1673647247, value: 0.13002259 },
        { time: 1673650846, value: 0.13000733 },
        { time: 1673654444, value: 0.13004104 },
        { time: 1673658041, value: 0.11959875 },
        { time: 1673661641, value: 0.11904622 },
        { time: 1673665241, value: 0.11922465 },
        { time: 1673668844, value: 0.12727977 },
        { time: 1673672442, value: 0.12718525 },
        { time: 1673676041, value: 0.12734885 },
        { time: 1673679645, value: 0.14860399 },
        { time: 1673683245, value: 0.14884895 },
        { time: 1673686842, value: 0.14916501 },
        { time: 1673690444, value: 0.17505176 },
        { time: 1673694047, value: 0.17467005 },
        { time: 1673697645, value: 0.17455078 },
        { time: 1673701244, value: 0.1910654 },
        { time: 1673704848, value: 0.19128368 },
        { time: 1673708444, value: 0.19124045 },
        { time: 1673712048, value: 0.19785293 },
        { time: 1673715644, value: 0.19787174 },
        { time: 1673719247, value: 0.19786275 },
        { time: 1673722843, value: 0.1887709 },
        { time: 1673726441, value: 0.18854375 },
        { time: 1673730040, value: 0.18838706 },
        { time: 1673733647, value: 0.17975179 },
        { time: 1673737244, value: 0.17946223 },
        { time: 1673740844, value: 0.179648 },
        { time: 1673744440, value: 0.17524821 },
        { time: 1673748037, value: 0.17622663 },
        { time: 1673751642, value: 0.17605896 },
        { time: 1673755242, value: 0.15487001 },
        { time: 1673758841, value: 0.15481051 },
        { time: 1673762445, value: 0.1552456 },
        { time: 1673766042, value: 0.15942666 },
        { time: 1673769642, value: 0.15929451 },
        { time: 1673773247, value: 0.15952171 },
        { time: 1673776847, value: 0.17088538 },
        { time: 1673780443, value: 0.17113602 },
        { time: 1673784041, value: 0.17156926 },
        { time: 1673787644, value: 0.19559288 },
        { time: 1673791244, value: 0.19513918 },
        { time: 1673794846, value: 0.1949909 },
        { time: 1673798446, value: 0.21413837 },
        { time: 1673802040, value: 0.21446757 },
        { time: 1673805644, value: 0.21431235 },
        { time: 1673809242, value: 0.208676 },
        { time: 1673812841, value: 0.20865315 },
        { time: 1673816446, value: 0.20868072 },
    ]);
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
                fetchHistory(),
                fetch(
                    "https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=1"
                ),
            ]);
            const customData = customResponse;
            const btcData = await btcResponse.json();
            const customLabels = customData.map((d) =>
                new Date(d.time * 1000).toLocaleString()
            );
            const customValues = customData.map((d) => d.value);
            const btcLabels: string[] = [];
            const btcPrices: number[] = [];
            btcData.result.XXBTZUSD.forEach((d: [number, number]) => {
                btcLabels.push(new Date(d[0] * 1000).toLocaleString());
                btcPrices.push(d[1]);
            });
            setChartData({
                labels: [...customLabels, ...btcLabels],
                customData: customValues,
                btcData: btcPrices,
            });
        };
        fetchData();
    }, []);

    return (
        <Line
            data={{
                labels: chartData.labels,
                datasets: [
                    {
                        label: "App ranking index",
                        data: chartData.customData,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                        yAxisID: "custom-axis",
                    },
                    {
                        label: "Bitcoin Price (USD)",
                        data: chartData.btcData,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                        yAxisID: "btc-axis",
                    },
                ],
            }}
            options={{}}
            // options={{
            //     scales: {
            //         yAxes: [
            //             {
            //                 id: "custom-axis",
            //                 type: "linear",
            //                 position: "left",
            //                 ticks: { beginAtZero: true },
            //             },
            //             {
            //                 id: "btc-axis",
            //                 type: "logarithmic",
            //                 position: "right",
            //                 ticks: { beginAtZero: true },
            //             },
            //         ],
            //     },
            // }}
        />
    );
};
