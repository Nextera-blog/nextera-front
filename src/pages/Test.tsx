import { useState } from "react";
import SubmitButton from "../components/SubmitButton";

const Test: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="mb-10">Connexion</h1>
            <div id="div-pour-form" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form>
                <div>
                    <label className="block" htmlFor="email">Email</label>
                    <input 
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />                    
                </div>
                <div>
                    <label className="block" htmlFor="password">Mot de passe</label>
                    <input 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <SubmitButton />
                </div>
            </form>
            </div>
        </div>
    )
}

export default Test;