import fetch from "node-fetch";

const POP_ID_FREE_APPS = "27";
const GENRE_FINANCE = "6015";
const ITUNES_URL = `https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewTop?genreId=${GENRE_FINANCE}&popId=${POP_ID_FREE_APPS}&dataOnly=true&cc=us`;

type TopCharts = {
    id: string;
    adamIds: string[];
};

type TopChartsResponse = {
    topCharts: TopCharts[];
};

export const fetchUSFinanceAppIds = async (): Promise<string[]> => {
    const data = (await fetch(ITUNES_URL, {
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent":
                "iTunes/11.1.1 (Windows; Microsoft Windows 7 x64 Ultimate Edition Service Pack 1 (Build 7601)) AppleWebKit/536.30.1",
            XAppleStoreFront: "143441­1,17",
        },
    }).then((response) => response.json())) as TopChartsResponse;
    const ids =
        data.topCharts.find((tc) => tc.id === POP_ID_FREE_APPS)?.adamIds || [];

    return ids;
};
