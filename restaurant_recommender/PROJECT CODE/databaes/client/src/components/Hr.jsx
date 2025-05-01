// eslint-disable-next-line react/prop-types
export default function Hr({ className }) {
    return (
        <hr
            className={`mb-1 h-[2px] w-full border-none border-black bg-black ${className}`}
        />
    );
}
