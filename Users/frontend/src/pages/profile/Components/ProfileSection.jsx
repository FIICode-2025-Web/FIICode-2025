import { useUser } from "@/context/LoginRequired";
import { Card, Typography } from "@material-tailwind/react";

export default function ProfileSection() {
    const { username, email } = useUser();

    return (
        <div className="">
            <div className="flex mb-4">
                <Typography variant="h1" className="text-gray-200 font-semibold ">
                    Salutare,
                </Typography>
                <Typography variant="h1" className="text-primary font-semibold ml-2">
                    {email.split('@')[0]}
                </Typography>
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
