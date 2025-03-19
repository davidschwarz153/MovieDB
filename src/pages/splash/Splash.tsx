import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Splash() {
    return (

        <Link to="/intro">

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
        </Link>
    );
}
