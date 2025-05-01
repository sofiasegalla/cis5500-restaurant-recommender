/* eslint-disable react/prop-types */

export default function Button(props) {
    return (
        <button
            onClick={props.onClick}
            className={`shadow-button-dark hover:shadow-button-dark rounded-lg border-b border-t border-rose-600 border-opacity-70 bg-rose-600 px-5 py-3 text-white duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98] ${props.className}`}
        >
            {props.children}
        </button>
    );
}
