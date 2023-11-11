import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { Environment } from "../root";
import { getTwitchToken } from "../twitch/token";

export const meta: MetaFunction = () => {
  return [
    { title: "Evil League by Bimbolatte" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const participants = [
  "mikiimoonlight",
  "ayanaeh",
  "fede_sbs",
  "morninglyre",
  "mikahel",
  "cuixy",
  "regaliax2",
  "aniriah",
];

type TwitchBroadcaster = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
};

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.env as Environment;
  const twitchToken = await getTwitchToken({
    clientId: env.TWITCH_CLIENT_ID,
    clientSecret: env.TWITCH_CLIENT_SECRET,
  });

  const params = new URLSearchParams();
  for (const participant of participants) {
    params.append("login", participant);
  }

  const usersResponse = await (
    await fetch(`https://api.twitch.tv/helix/users?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${twitchToken}`,
        "Client-Id": env.TWITCH_CLIENT_ID,
      },
    })
  ).json<{ data: TwitchBroadcaster[] }>();

  return json({ users: usersResponse.data });
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div
      className="flex items-center justify-center min-h-screen flex-col "
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <h1 className="sr-only">Evil League</h1>
      <img className="max-w-[50vw]" alt="Evil League" src="/img/Evil_Le.avif" />
      <div className="flex flex-row flex-wrap gap-4 m-4 justify-center max-w-6xl">
        {users.map((participant) => (
          <a
            key={participant.id}
            href={`https://twitch.tv/${participant.login}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="space-y-3 w-[250px] rounded-2xl shadow-lg"
              src={participant.profile_image_url}
              aria-hidden
              alt={`${participant.display_name} profile picture`}
            ></img>
            <p className="text-xl my-2 font-bold">{participant.display_name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
