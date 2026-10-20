import { useNavigate } from "react-router";
// import Card from "./Card";

export default function Home() {
    const navigate = useNavigate()
    return (
        <div>
            this is the home page
            {/* <Card /> */}

            <button
                onClick={() => navigate('/dashboard')}
            >
                go to dashboard
            </button>

            <button
                onClick={() => navigate('/settings')}
            >
                go to settings
            </button>
        </div>
    )
}