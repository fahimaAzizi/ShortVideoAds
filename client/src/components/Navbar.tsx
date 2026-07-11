import { MenuIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useClerk, useUser } from '@clerk/clerk-react'; // Fixed import

export default function Navbar() {
    const { user } = useUser();
    const { openSignIn, openSignUp } = useClerk();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Create', href: '/generate' },
        { name: 'Community', href: '/community' },
        { name: 'FAQ', href: '/#faq' },
    ];

    // Fixed scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.nav 
            className='fixed top-5 left-0 right-0 z-50 px-4'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='max-w-6xl mx-auto flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/4 rounded-2xl p-3'>
                <Link to="/" onClick={scrollToTop}>
                    <img src={assets.logo} alt="logo" className="h-8" />
                </Link>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-300'>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.href} 
                            onClick={scrollToTop}
                            className="hover:text-white transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Buttons */}
                <div className='hidden md:flex items-center gap-3'>
                    {!user ? (
                        <>
                            <button 
                                onClick={() => openSignIn()} 
                                className='text-sm font-medium text-gray-300 hover:text-white transition'
                            >
                                Sign in
                            </button>
                            <PrimaryButton 
                                onClick={() => openSignUp()} 
                                className='max-sm:text-xs'
                            >
                                Get Started
                            </PrimaryButton>
                        </>
                    ) : (
                        <PrimaryButton 
                            onClick={() => {/* Handle sign out */}} 
                            className='max-sm:text-xs'
                        >
                            Dashboard
                        </PrimaryButton>
                    )}
                </div>

                {/* Mobile Menu Toggle - Always visible on mobile */}
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className='md:hidden'
                    aria-label="Toggle menu"
                >
                    <MenuIcon className='size-6' />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className='fixed inset-0 bg-black/40 backdrop-blur-md z-50 md:hidden'>
                    <div className='flex flex-col items-center justify-center gap-6 text-lg font-medium h-full'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => {
                                    setIsOpen(false);
                                    scrollToTop();
                                }}
                                className="hover:text-white transition"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {!user ? (
                            <>
                                <button 
                                    onClick={() => {
                                        openSignIn();
                                        setIsOpen(false);
                                    }} 
                                    className='font-medium text-gray-300 hover:text-white transition'
                                >
                                    Sign in
                                </button>
                                <PrimaryButton 
                                    onClick={() => {
                                        openSignUp();
                                        setIsOpen(false);
                                    }}
                                >
                                    Get Started
                                </PrimaryButton>
                            </>
                        ) : (
                            <PrimaryButton 
                                onClick={() => {
                                    setIsOpen(false);
                                    // Handle sign out or dashboard navigation
                                }}
                            >
                                Dashboard
                            </PrimaryButton>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-8 right-8 rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition"
                            aria-label="Close menu"
                        >
                            <XIcon className='size-6' />
                        </button>
                    </div>
                </div>
            )}
        </motion.nav>
    );
}