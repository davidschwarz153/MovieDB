import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/intro');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <section className="bg-gradient-to-r from-red-600 to-red-500 h-screen flex justify-center items-center text-white">
            <motion.h1 
                className="text-6xl font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                .MOV
            </motion.h1>
        </section>
    );
}
