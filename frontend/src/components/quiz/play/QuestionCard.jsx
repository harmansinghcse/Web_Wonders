import AnswerOption from "./AnswerOption";

// TODO (Backend)
//
// Replace this static data using:
//
// GET /api/quiz/play/:slug/:difficulty
//
// {
//   question,
//   image,
//   options
// }

const QuestionCard = ({
    question,
    selectedOption,
    onSelect,
}) => {
    
    return (
        <section className="mx-auto mt-8 max-w-5xl px-6">
            <div className="rounded-[30px] border border-[#E7DDC8] bg-white p-8 shadow-sm">

                {/* Question */}
                <h2 className="text-3xl font-bold leading-relaxed text-[#222]">
                    {question.text}
                </h2>

                {/* Image */}
                {question.image && (
                    <div className="mt-8 overflow-hidden rounded-[24px]">
                        <img src={question.image} alt="Question" className="h-72 w-full object-cover"/>
                    </div>
                )}

                {/* Options */}
                <div className="mt-8 space-y-4">
                    {question.options.map((option, index) => (

                        <AnswerOption
                            key={index}
                            index={index}
                            text={option}
                            selected={selectedOption === index}
                            onClick={() => onSelect(index)}
                        />

                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuestionCard;