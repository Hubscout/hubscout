import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const Video = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<null | any>(null);

  useEffect(() => {
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      const video = videoRef.current;
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video as any);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (video) video.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  return (
    <video
      ref={videoRef}
      className="max-w-full max-h-72 rounded-lg"
      controls
    ></video>
  );
};

export default Video;
