import { Midjourney } from "midjourney";

const SERVER_ID = process.env.SERVER_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const SALAI_TOKEN = process.env.SALAI_TOKEN;

if (!SERVER_ID || !CHANNEL_ID || !SALAI_TOKEN) {
  throw new Error("Required environment variables are not set. Please check .env file.");
}

const client = new Midjourney({
  ServerId: SERVER_ID,
  ChannelId: CHANNEL_ID,
  SalaiToken: SALAI_TOKEN,
  Debug: true,
  Ws: true,
});

export async function generateImg(prompt: string): Promise<string> {
    await client.init();
    
    const Imagine = await client.Imagine(
      prompt,
      (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      }
    );

    const hash = Imagine?.hash || "";
    if (!hash) {
      throw new Error("Failed to generate image: No hash returned");
    }

    // CDN URLの生成
    const imageUrl = `https://cdn.midjourney.com/${hash}/0_0.png`;
    client.Close()
    return imageUrl;
}

// ファイルが直接実行された場合のサンプル実行
if (process.argv[1].endsWith('generateImg.ts')) {
    // f"{self.theme} {self.style} {self.subject} {self.background} {self.main_color} {self.detailed_description}"
    // の形式に従ったサンプルプロンプト
    const theme = "Playful Pet";
    const style = "digital art style";
    const subject = "kitten";
    const background = "cozy living room with soft lighting";
    const main_color = "warm orange and red tones";
    const detailed_description = "A small kitten enthusiastically playing with a red ball of yarn, creating a heartwarming and dynamic scene";

    const samplePrompt = `${theme} ${style} ${subject} ${background} ${main_color} ${detailed_description}`;
    console.log("Generating image with sample prompt:", samplePrompt);
    
    generateImg(samplePrompt)
        .then(url => {
            console.log("Generated image URL:", url);
        })
        .catch(error => {
            console.error("Error generating image:", error);
        });
}
