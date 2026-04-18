import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function UploadContentScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Add a title before uploading.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Uploaded", "Your content has been submitted.");
      setTitle("");
      setCategory("");
      setDescription("");
    }, 600);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Upload Content</Text>
          <Text style={styles.subtitle}>
            Add new materials or resources for learners.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Organic chemistry notes"
            placeholderTextColor="#9AA0B4"
            style={styles.input}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Materials, Assignments, Resources"
            placeholderTextColor="#9AA0B4"
            style={styles.input}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Brief summary of the content"
            placeholderTextColor="#9AA0B4"
            style={[styles.input, styles.textarea]}
            multiline
          />

          <Pressable
            style={[
              styles.submitButton,
              isSubmitting ? styles.submitDisabled : null,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Feather name="upload" size={16} color="#FFFFFF" />
            <Text style={styles.submitText}>
              {isSubmitting ? "Uploading" : "Upload"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F3F9",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  subtitle: {
    fontSize: 13,
    color: "#7A7D92",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7A7D92",
  },
  input: {
    backgroundColor: "#F7F8FC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2D2E3A",
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#34356E",
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
