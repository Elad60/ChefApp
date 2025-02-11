import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { View, Button } from "react-native";
import CustomButton from "./CustomButton";

export default function VideoScreen({ video, setPlay }) {
  const player = useVideoPlayer(video, (player) => {
    player.play();
  });

  return (
    <View className="flex-1 items-center justify-center px-10 py-5">
      <View className="w-72 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>
      <View className="absolute-buttom">
        <CustomButton
          title="Close Video"
          handlePress={() => setPlay(false)}
          containerStyles="mt-0 px-3 py-1 rounded-md text-xs text-white"
        />
      </View>
    </View>
  );
}
