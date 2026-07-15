export default function QuizFeature({
    icon,
    title,
    subtitle,
}) {

    return (

        <div className="flex flex-col items-start">

            <div
                className="
                mb-8
                flex
                h-[68px]
                w-[68px]
                items-center
                justify-center
                rounded-full
                bg-[#EDF4E7]
                "
            >

                {icon}

            </div>

            <h4
                className="
                text-xl
                font-semibold
                text-[#202020]
                "
            >
                {title}
            </h4>

            <p
                className="
                mt-2
                max-w-[140px]
                text-[15px]
                leading-7
                text-[#666]
                "
            >
                {subtitle}
            </p>

        </div>

    );

}