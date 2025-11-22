import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StoryLine = {
  text: string;
  prompt: string;
};

export default function StoryReaderScreen() {
  const router = useRouter();
  const { story } = useLocalSearchParams();

  const [index, setIndex] = useState(0);

  // Parse story safely
  const lines: StoryLine[] = useMemo(() => {
    if (!story) return [];
    try {
      const raw = Array.isArray(story) ? story[0] : story;
      const decoded = decodeURIComponent(raw ?? "");
      const parsed = JSON.parse(decoded);
      return Array.isArray(parsed) ? parsed : parsed.lines ?? [];
    } catch (e) {
      console.error("Failed to parse story param:", e);
      return [];
    }
  }, [story]);

  const current = lines[index];

  return (
    <ImageBackground
      source={require("../assets/images/bg-gradient.png")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.5 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="ml-6 mt-2 bg-white size-12 rounded-full justify-center items-center"
        >
          <Entypo name="chevron-left" size={27} />
        </Pressable>

        <View className="flex-1 p-6">
          <ScrollView contentContainerStyle={{ gap: 20 }}>
            <Image
              source={require("../assets/images/bg-gradient.png")}
              resizeMode="cover"
              className="w-full h-[400px] rounded-2xl shadow bg-gray-200"
            />
            <Text className="text-lg text-white">
              {current?.text ?? "No story available."}
            </Text>
          </ScrollView>
          {/* Pagination */}
          <View className="flex-row justify-between items-center mt-6">
            <Button
              title="Previous"
              disabled={index === 0}
              onPress={() => setIndex((i) => Math.max(i - 1, 0))}
            />
            <Text className="text-base text-gray-200">
              {lines.length ? index + 1 : 0}/{lines.length}
            </Text>
            <Button
              title="Next"
              disabled={index >= lines.length - 1}
              onPress={() => setIndex((i) => Math.min(i + 1, lines.length - 1))}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
