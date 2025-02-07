import express from 'express';
import { generateImg } from './generateImg.js';

type GenerateRequest = {
    prompt: string;
    imageId: string;
}

type GenerateResponse = {
    success: boolean;
    img_url: string;
}

type ErrorResponse = {
    error: string;
    details?: string;
}

const app = express();
const port = process.env.PORT || 3000;

// JSONボディパーサーを有効化
app.use(express.json());

// POSTエンドポイント
app.post('/generate', (
    req: express.Request<{}, GenerateResponse | ErrorResponse, GenerateRequest>,
    res: express.Response<GenerateResponse | ErrorResponse>
) => {
    const handleGenerate = async () => {
        try {
            const { prompt,imageId } = req.body;
            
            if (!prompt) {
                return res.status(400).json({
                    error: 'プロンプトが必要です'
                });
            }

            const img = await generateImg(prompt);
            
            return res.json({
                success: true,
                img_url: img
            });
        } catch (error) {
            console.error('画像生成エラー:', error);
            return res.status(500).json({
                error: '画像生成中にエラーが発生しました',
                details: error instanceof Error ? error.message : '不明なエラー'
            });
        }
    };

    handleGenerate().catch(error => {
        console.error('予期せぬエラー:', error);
        res.status(500).json({
            error: '予期せぬエラーが発生しました',
            details: error instanceof Error ? error.message : '不明なエラー'
        });
    });
});

// サーバー起動
app.listen(port, () => {
    console.log(`サーバーが起動しました: http://localhost:${port}`);
});