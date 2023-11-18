import { ChevronRightIcon } from "@radix-ui/react-icons";
import { defer, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import { Suspense } from "react";
import Live from "../components/live";
import { Button } from "../components/ui/button";
import { type Environment } from "../root";
import { getStreams, getUsersData } from "../twitch/requests";
import { getTwitchToken } from "../twitch/token";
import { ChevronLeftIcon } from "lucide-react";

export async function loader({ context, params }: LoaderFunctionArgs) {
  const login = params.login;

  if (!login) {
    throw new Error("No login provided");
  }

  const env = context.env as Environment;
  const twitchToken = await getTwitchToken({
    clientId: env.TWITCH_CLIENT_ID,
    clientSecret: env.TWITCH_CLIENT_SECRET,
  });

  const streams = getStreams({
    channels: [login],
    token: twitchToken,
    clientId: env.TWITCH_CLIENT_ID,
  });

  const streamer = await getUsersData({
    channels: [login],
    token: twitchToken,
    clientId: env.TWITCH_CLIENT_ID,
  }).then((streamers) => streamers[0]);

  return defer({ streamer, streams });
}

export default function ParticipantDetail() {
  const { streamer, streams: asyncStreams } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <>
      <Button
        onClick={() => {
          navigate(-1);
        }}
        variant="ghost"
        size="icon"
        className="fixed left-0 top-0 m-4"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <div className="container py-8 flex items-center justify-center flex-col">
        <h1 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {streamer.display_name}
        </h1>
        <img
          src={streamer.profile_image_url}
          alt={`${streamer.display_name} profile picture`}
          aria-hidden
        />
        <Suspense fallback={undefined}>
          <Await resolve={asyncStreams}>
            {(streams) => <Live isLive={!!streams[0]} />}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
