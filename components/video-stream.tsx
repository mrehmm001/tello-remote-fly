"use client";

import React from "react";

import JsmpegPlayer from "@/components/jsmpeg-player";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";

const videoOptions = {
  poster:
    ""
};

const videoOverlayOptions = {};

interface VideoPlayerProps{
  socket_url:string
}

function VideoPlayer({socket_url}:VideoPlayerProps) {
  let jsmpegPlayer:any = null;
  return (
    <div className="h-full p-2">
          { socket_url &&
                <JsmpegPlayer
                // @ts-ignore
                wrapperClassName="w-full h-full object-cover"
                videoUrl={socket_url}
                options={videoOptions}
                overlayOptions={videoOverlayOptions}
                // @ts-ignore
                onRef={(ref) => (jsmpegPlayer = ref)}
              />
          }

    </div>
  );
}

export default VideoPlayer;