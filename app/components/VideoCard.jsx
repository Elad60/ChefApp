import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import VideoScreen from "./VideoScreen";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex-col items-center px-4 mb-6">
      {" "}
      {/* Reduced margin */}
      <View className="flex-row gap-3 items-start" style={{ maxHeight: 200 }}>
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {/* Conditional Rendering for Play State */}
      {play ? (
        <VideoScreen
        video={video}
        setPlay={setPlay}
        otherStyles="w-full h-60 rounded-xl mt-"
        />
      ) : (
        <TouchableOpacity
        activeOpacity={0.7}
          className="w-full mt-3 relative justify-center items-center"
          style={{ height: 200 }} // Set height for TouchableOpacity to control the size
          onPress={() => setPlay(true)} // Optionally, toggle play state on press
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full mt-3 rounded-xl"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
