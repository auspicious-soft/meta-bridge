import Logo from "../Assets/logo.png"
import ContactButton from "./ContactButton";
import useDetectCountry from "../Hooks/useDetectCountry";
import translations from "../translations";

const Header = () => {
    const country = useDetectCountry();
    const lang = country === "IT" ? "it" : "en";
    const t = translations[lang];
    
    return (
        <header className="fixed top-0 left-0 right-0 w-full z-50 py-3 bg-[#d9d9d9]/10 backdrop-blur-[4px]">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <a href="/">
                            <img className="max-w-[100px]" src={Logo} alt="" />
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <ContactButton label={t.contactUsLabel} />
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;
