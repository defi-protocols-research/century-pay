import dbConnect from "../../../lib/dbConnect";
import {
    createConfig,
} from "wagmi";
import { http } from "@wagmi/core";
import {
    base,
    baseSepolia,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "wagmi/chains";
import sendlink from "../../../models/sendlink";
import { NextRequest } from "next/server";


const chains = [
    mainnet,
    sepolia,
    base,
    baseSepolia,
    optimism,
    optimismSepolia,
] as const;
const signConfig = createConfig({
    chains: chains,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [base.id]: http(),
        [baseSepolia.id]: http(),
        [optimism.id]: http(),
        [optimismSepolia.id]: http(),
    },
});


export async function GET(req: NextRequest) {
    const sendautolink = req.nextUrl.searchParams.get("sendautolink");
    try {
        await dbConnect();
        const sendlinks = await sendlink.findOne({ sendautolink });

        return Response.json(JSON.stringify(sendlinks));
    } catch (error) {
        console.error(error);
        return Response.json({ error: "error" }, { status: 400 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { sendautolink, transactionHash } = body;
    try {
        await dbConnect();

        const res = await sendlink.updateOne(
            { sendautolink: sendautolink },
            { transactionHash: transactionHash }
        );

        return Response.json(JSON.stringify(res));

    } catch (error) {
        console.error(error);
        return Response.json({ error: error }, { status: 400 });
    }
}