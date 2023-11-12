import {
  json,
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  defer,
} from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import type { Environment } from "../root";
import { getTwitchToken } from "../twitch/token";
import { getStreams, getUsersData } from "../twitch/requests";
import { Suspense } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Evil League by Bimbolatte" },
    { name: "description", content: "Evil League by Bimbolatte" },
  ];
};

const participants = [
  "mikiimoonlight",
  "ayanaeh",
  "fede_sbs",
  "morninglyre",
  "ElMikahel",
  "cuixy",
  "regaliax2",
  "aniriah",
];

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, s-maxage=3600",
  };
};

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.env as Environment;
  const twitchToken = await getTwitchToken({
    clientId: env.TWITCH_CLIENT_ID,
    clientSecret: env.TWITCH_CLIENT_SECRET,
  });

  const [streamersInfo, streams] = await Promise.all([
    getUsersData({
      channels: participants,
      token: twitchToken,
      clientId: env.TWITCH_CLIENT_ID,
    }),
    getStreams({
      channels: participants,
      token: twitchToken,
      clientId: env.TWITCH_CLIENT_ID,
    }),
  ]);

  const usersWithLiveStatus = streamersInfo
    .map((streamer) => {
      const stream = streams.find((stream) => stream.user_id === streamer.id);
      return { ...streamer, live: !!stream };
    })
    .sort((a, b) => {
      if (a.live && !b.live) return -1;
      if (!a.live && b.live) return 1;
      return 0;
    });

  return defer(
    { users: usersWithLiveStatus },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div
      className="flex items-center justify-center min-h-screen flex-col "
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <h1 className="sr-only">Evil League</h1>
      <img
        className="max-w-[50vw] -mt-12"
        alt="Evil League"
        src="/img/Evil_Le.avif"
      />
      <p className="text-xl mb-2 -mt-14 font-bold">
        By{" "}
        <a
          className="font-bold text-primary underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
          href="https://twitch.tv/bimbolatte_"
        >
          Bimbolatte
        </a>{" "}
        y{" "}
        <a
          className="font-bold text-primary underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
          href="https://twitch.tv/evilist_"
        >
          Evilist
        </a>
      </p>
      <div className="flex flex-row flex-wrap gap-4 m-4 justify-center max-w-6xl">
        {users.map((participant) => (
          <a
            key={participant.id}
            href={`https://twitch.tv/${participant.login}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="space-y-3 w-[150px] lg:w-[250px] rounded-2xl shadow-lg h-auto object-cover transition-all hover:scale-105"
              src={participant.profile_image_url}
              aria-hidden
              alt={`${participant.display_name} profile picture`}
            ></img>
            <div className="flex justify-between items-center">
              <p className="text-xl my-2 font-bold">
                {participant.display_name}
              </p>
              {participant.live && (
                <p className="text-lg my-2 bg-red-600 px-4 rounded-full font-bold">
                  Live
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
