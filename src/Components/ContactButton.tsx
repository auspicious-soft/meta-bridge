import { ArrowRight } from "lucide-react";

type ContactButtonProps = {
  label: string; 
};

const ContactButton = ({ label }: ContactButtonProps) => {
    return (
        <a href="https://form.jotform.com/nicotel/-onboarding-metabridge" target="_blank" data-property-1="Default" className="contact-button button-hover pl-[30px] pr-1 py-1 relative bg-black rounded-[99px] border-[1px] border-solid border-transparent inline-flex justify-center items-center gap-2.5 overflow-hidden md:min-w-[158px]">
            <div className="hover-bg w-[100px] h-[52px] left-[29px] top-[49px] absolute bg-[#009aff] rounded-full blur-[25px]" />
            <div className="justify-start text-white text-sm text text-light">{label}</div>
            <div className="contact-button p-[10px] bg-black/25 rounded-[99px] border-[1px] border-solid border-transparent flex justify-center items-center gap-2.5 icon ">
                <ArrowRight strokeWidth={1.5} className="w-4 h-4  md:w-5 md:h-5 text-white" />
            </div>
        </a> 
    );
}

export default ContactButton;
