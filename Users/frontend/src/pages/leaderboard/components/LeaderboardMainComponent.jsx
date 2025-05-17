import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faStar } from "@fortawesome/free-solid-svg-icons";

const LeaderboardMainComponent = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
            "http://127.0.0.1:8002/api/v1/gamification/leaderboard",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        data.sort((a, b) => b.user_score - a.user_score);
+       setLeaderboard(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const renderMedal = (rank) => {
        const size = "text-2xl";
        if (rank === 0)
            return <FontAwesomeIcon icon={faMedal} className={`text-yellow-400 ${size}`} />;
        if (rank === 1)
            return <FontAwesomeIcon icon={faMedal} className={`text-gray-400 ${size}`} />;
        if (rank === 2)
            return <FontAwesomeIcon icon={faMedal} className={`text-yellow-700 ${size}`} />;
        return <span className="text-gray-400 font-medium">{rank + 1}</span>;
    };

    const renderStars = (score) => {
        const maxScore = leaderboard[0]?.user_score || 1;
        const stars = Math.round((score / maxScore) * 5);
        return (
            <div className="flex space-x-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < stars ? "text-yellow-300" : "text-gray-700"}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card className="bg-gray-900 p-4 md:p-6 rounded-2xl shadow-xl max-w-3xl mx-auto">
            <Typography
                variant="h5"
                className="text-white font-semibold text-center mb-4 md:mb-6"
            >
                CLASAMENT
            </Typography>

            {loading ? (
                <Typography className="text-white text-center py-10">Loading...</Typography>
            ) : (
                <>
                    <div className="hidden md:grid grid-cols-[48px_1fr_96px_80px_80px] text-gray-400 uppercase text-xs mb-2 px-4">
                        <div className="text-center">#</div>
                        <div>Nume</div>
                        <div className="text-center">Rating</div>
                        <div className="text-right">Scor</div>
                        <div className="text-right">Medalii</div>
                    </div>

                    <div className="h-80 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                        {leaderboard.map((user, idx) => (
                            <div key={user.user_id}>
                                <div className="hidden md:grid grid-cols-[48px_1fr_96px_80px_80px] items-center bg-gray-800 hover:bg-gray-700 transition rounded-lg px-4 py-3">
                                    <div className="text-center">{renderMedal(idx)}</div>
                                    <div>
                                        <Typography className="text-white font-medium truncate">
                                            {user.username}
                                        </Typography>
                                    </div>
                                    <div className="text-center">{renderStars(user.user_score)}</div>
                                    <div className="text-right">
                                        <Typography className="text-blue-400 font-semibold">
                                            {user.user_score}
                                        </Typography>
                                    </div>
                                    <div className="text-right">
                                        <Typography className="text-green-400 font-semibold">
                                            {user.total_badges}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="md:hidden bg-gray-800 hover:bg-gray-700 transition rounded-lg px-4 py-3 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {renderMedal(idx)}
                                            <Typography className="text-white font-medium truncate">
                                                {user.username}
                                            </Typography>
                                        </div>
                                        <Typography className="text-blue-400 font-semibold">
                                            {user.user_score}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{renderStars(user.user_score)}</span>
                                        <span>{user.total_badges} medalii</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
};

export default LeaderboardMainComponent;
