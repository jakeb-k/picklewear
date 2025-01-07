export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `hover:bg-secondary hover:text-main hover:border-2 hover:border-main transition-all duration-200 ease-in-out text-lg font-oswald px-4 py-1 border-2 border-black bg-main rounded-lg text-nowrap w-32 flex justify-center items-center space-x-1 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
