export default function NavigationMenu(props){
    const options = props.options; 


    return (
        <div className="bg-[#e5e7eb] p-8 w-[75%] mx-auto absolute flex">
            <div>
                <h3 className="font-bold">Shop By Price</h3>
                <ul className='text-secondary'>
                    <li className='bold'>On Sales</li>
                    <li className='hover:underline'>$20 or Under</li>
                    <li className='hover:underline'>$30 or Under</li>
                    <li className='hover:underline'>$40 or Under</li>
                    <li className='hover:underline'>Bundle Deals</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold">Shop By Category</h3>
                <div className="flex flex-wrap text-secondary">
                    {options.map((option) => {
                        return(
                            <p className="w-[47.5% mr-[2.5%]">{option}</p>
                        )
                    })}
                </div>
            </div>
            <div className='p-12 rounded-xl text-2xl bg-secondary hover:animate-pulse hover:bg-main border-main transition-all duration-150 ease-in-out text-secondary hover:text-main'>
                Shop Summer Collection
            </div>
        </div>
    )
}