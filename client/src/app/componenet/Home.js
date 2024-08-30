"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";  // Correct import
import { useState } from "react";

function Home() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary">
                <div className="container">
                    <Link href="/" className="navbar-brand">
                        Vishvajeet
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarNav"
                        aria-expanded={isOpen ? 'true' : 'false'}
                        aria-label="Toggle navigation"
                        onClick={toggleNavbar}  // Add onClick handler
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className={`nav-item ${router.pathname == '/' ? 'active' : ''}`}>
                                <Link href="/" className="nav-link">
                                    Home
                                </Link>
                            </li>
                            <li className={`nav-item ${router.pathname == '/about' ? 'active' : ''}`}>
                                <Link href="/about" className="nav-link">
                                    About
                                </Link>
                            </li>
                            <li className={`nav-item ${router.pathname == '/services' ? 'active' : ''}`}>
                                <Link href="/services" className="nav-link">
                                    Services
                                </Link>
                            </li>
                            <li className={`nav-item ${router.pathname == '/contact' ? 'active' : ''}`}>
                                <Link href="/contact" className="nav-link">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Home;
