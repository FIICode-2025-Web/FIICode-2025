import { useUser } from "@/context/LoginRequired";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function ProfileSection() {
    const { username, email } = useUser();
    const navigate = useNavigate();

    return (
        <div className="">
            <div className="flex flex-col md:flex-row mb-4 justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row items-center">
                    <Typography variant="h1" className="text-gray-200 font-semibold ">
                        Salutare,
                    </Typography>
                    <Typography variant="h1" className="text-primary font-semibold ml-2">
                        {email.split('@')[0]}
                    </Typography>
                </div>
                <Button
                    variant="outlined"
                    className="h-10 w-20 text-white bg-red-700 border-red-700 hover:bg-red-500 flex items-center justify-center mt-4 md:mt-0"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    Logout
                </Button>
            </div>

            <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
                <Typography variant="h5" className="text-white font-semibold">
                    Profil
                </Typography>

                <div className="space-y-2">
                    <div>
                        <p className="text-sm text-gray-400">Nume de utilizator</p>
                        <p className="text-base font-medium">{email.split('@')[0]}</p>
                    </div>

                    <hr className="border-gray-700" />

                    <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-base text-gray-200 font-medium">{email}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
