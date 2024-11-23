export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 relative` + className}>
            {value ? value : children}
            {props.isRequired ? <span className='text-red-400 text-2xl absolute top-0 ml-2'>*</span> :'' }
        </label>
    );
}
