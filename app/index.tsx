import FormField from "@/components/FormField";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [loading, setLoading] = useState<boolean>(false);
  const [seed, setSeed] = useState<string>("");
  const router = useRouter();

  const onGenerate = async () => {
    if (!seed.trim()) {
      Alert.alert("Please enter a sentence");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/aistory", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ seed }),
      });
      if (!res.ok) {
        throw new Error("Failed to generate the story");
      }
      const data = await res.json();
      console.log("Generated story:", data.story);
      router.push({
        pathname: "/story",
        params: {
          story: encodeURIComponent(JSON.stringify(data.story)),
        },
      });
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-gradient.png")}
      resizeMode="cover"
      className="flex-1 align-center"
    >
      <View className="flex-1 p-6 justify-center gap-y-20">
        <View className="gap-y-2">
          <View>
            <Text className="text-5xl font-semibold text-center text-white">
              AI That Writes
            </Text>
            <Text className="text-5xl font-semibold text-center text-white">
              for you
            </Text>
          </View>
          <Text className="text-xl text-center text-neutral-600">
            Stories made from the ideas
          </Text>
        </View>

        <View className="gap-y-8">
          {/* Input */}
          <FormField
            placeholder="Type your idea..."
            placeholderTextColor="#7B7B8B"
            inputStyle="text-lg leading-5 border-2 border-neutral-300"
            value={seed}
            onChangeText={setSeed}
            editable={!loading}
          />
          <TouchableOpacity
            disabled={loading}
            onPress={onGenerate}
            className="bg-sky-700 justify-center items-center p-4 rounded-full"
          >
            <Text className="text-white font-semibold text-xl">
              {loading ? "Generating..." : "Generate Story"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
