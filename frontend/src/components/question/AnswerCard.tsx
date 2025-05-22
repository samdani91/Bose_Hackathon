import type { Answer } from "@/types";
import type React from "react";
import { Card, CardContent } from "../ui/Card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Languages, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

interface AnswerCardProps {
    answer: Answer;
    setIsUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserData {
    name: string;
    email: string;
    occupation: string;
    bio: string;
    image?: string;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ answer, setIsUpvoted }) => {
    const [answerInBangla, setAnswerInBangla] = useState<string>('');
    const [isTranslated, setIsTranslated] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${answer.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.user.name || !data.user.email) {
                throw new Error('Invalid user data received');
            }

            setUserData(data.user);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to fetch user data. Please try again.');
        }
    };

    useEffect(() => {
        if(answer.userId) fetchUser();
    }, []);

    const handleTranslate = async (answer: Answer) => {
        try {
            console.log('Sending translation request:', {
                answer: { text: answer.text },
            });

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/system/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    question: null,
                    answer: { text: answer.text },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown'}`
                );
            }

            const data = await response.json();
            console.log('Translation response:', data);

            if (!data.translation?.answer?.text) {
                throw new Error('Invalid translation response: missing answer text.');
            }

            setAnswerInBangla(data.translation.answer.text);
        } catch (error) {
            console.error('Translation error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to translate answer.');
        }
    };

    const handleReadAloud = async () => {
        try {
            const text = answer.text;
            console.log('Sending TTS request:', { answer: { text } });

            if (!text) {
                throw new Error('No valid text to read aloud.');
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/system/tts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    answer: { text: answer.text },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown'}`
                );
            }

            const data = await response.json();
            console.log('TTS response:', data);

            if (!data.audioUrl) {
                throw new Error('No audio URL returned from the server.');
            }

            const audio = new Audio(data.audioUrl);
            await audio.play();
            console.log('Audio playing:', data.audioUrl);

            audio.onended = () => console.log('Audio playback completed');
            audio.onerror = () => console.error('Audio playback error');
        } catch (error) {
            console.error('Read Aloud error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to read aloud.');
        }
    };

    useEffect(() => {
        if (isTranslated) {
            handleTranslate(answer);
        } else {
            setAnswerInBangla('');
        }
    }, [isTranslated, answer]);

    const handleUpvote = async (answer: Answer) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    question_id: null,
                    answer_id: answer.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upvote answer');
            }
            toast.success('Upvoted successfully!');
            setIsUpvoted(true);
        } catch (error) {
            console.error('Upvote error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to upvote answer');
        }
    };

    const handleDownvote = async (answer: Answer) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/down`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    question_id: null,
                    answer_id: answer.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            toast.success('Downvoted successfully!');
            setIsUpvoted(true);
        } catch (error) {
            console.error('Downvote error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to downvote answer');
        }
    };

    return (
        <div>
            <Card key={answer.id} className="border-2 border-emerald-300">
                <CardContent className="p-0">
                    <div className="flex">
                        {/* Voting */}
                        <div className="p-6 flex flex-col items-center w-16 md:w-20">
                            <button
                                className="rounded-full transition-all text-slate-400 hover:bg-slate-100 hover:text-emerald-500"
                                onClick={() => handleUpvote(answer)}
                                aria-label="Upvote"
                            >
                                <ArrowUp className="h-6 w-6 text-emerald-600" />
                            </button>
                            <div className="flex flex-row items-center mx-3 md:flex-col md:my-3 md:mx-0">
                                <span className="text-lg font-semibold text-slate-700">
                                    {answer.upVoteCount || 0}
                                </span>
                                <span className="my-2 md:my-2 md:mx-0 mx-2 w-0.5 h-6 md:w-6 md:h-0.5 bg-slate-200 rounded-full"></span>
                                <span className="text-lg font-semibold text-slate-700">
                                    {answer.downVoteCount || 0}
                                </span>
                            </div>
                            <button
                                className="rounded-full transition-all text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                                onClick={() => handleDownvote(answer)}
                                aria-label="Downvote"
                            >
                                <ArrowDown className="h-6 w-6 text-red-600" />
                            </button>
                            <div className="hidden md:flex md:flex-col items-center mt-6 space-y-3">
                                {/* Read Aloud Button */}
                                <button
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 transition-all"
                                    aria-label="Read answer aloud"
                                    onClick={handleReadAloud}
                                >
                                    <Volume2 className="h-5 w-5" />
                                </button>
                                {/* Translation Button */}
                                <button
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-500 transition-all"
                                    aria-label="Translate answer"
                                    onClick={() => {
                                        setIsTranslated((prev) => !prev);
                                        toast.info('Translating, please wait');
                                    }}
                                >
                                    <Languages className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        {/* Answer content */}
                        <div className="flex-1 p-6 border-l border-slate-100">
                            <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                                <p>{isTranslated ? answerInBangla : answer.text}</p>
                            </div>
                            <div className="mt-6 flex justify-end items-center">
                                <div className="flex items-center bg-slate-50 p-3 rounded-lg">
                                    <div className="flex-shrink-0">
                                        {userData?.image ? (
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={userData.image}
                                                alt={userData.name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                                                {userData?.name?.charAt(0) || 'AI'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        {userData ? <Link to={`/profile/${answer.userId}`} className="text-slate-700 hover:text-indigo-600">
                                            {userData?.name}
                                        </Link> : <span className="text-slate-700">AI Assistant</span>}
                                        <p className="text-xs text-slate-500">
                                            Answered {new Date(answer.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};