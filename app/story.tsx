import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
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

export default function StoryReaderScreen() {
  const router = useRouter();

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
          <ScrollView contentContainerClassName="gap-5">
            <Image
              source={require("../assets/images/bg-gradient.png")}
              resizeMode="cover"
              className="w-full h-[400px] rounded-2xl shadow bg-gray-200"
            />
            <Text className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia
              doloribus qui necessitatibus.
            </Text>
          </ScrollView>
          {/* pagination */}
          <View className="flex-row justify-between items-center mt-6">
            <Button title="Previous" />
            <Text className="text-base text-gray-700">1/9</Text>
            <Button title="Next" />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
