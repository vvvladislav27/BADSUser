

const setAnimationForText = (customClass) => {
    const items = document.querySelectorAll(customClass);
    const style = document.createElement("style");
    style.type = "text/css";
    let cssRules = '';    
    items.forEach((item) => {
        const textWidth = item.scrollWidth;
        const clientWidth = item.clientWidth;
        const textOverflow = textWidth - clientWidth;
        const animationDuration = Math.max(5, (textWidth / 100) * 5);
        if (textOverflow <= 0) return;
        const uniqueClass = `animate-name-${item.id}`;
        if (!item.classList.contains(uniqueClass)) {
            item.classList.add(uniqueClass);
            item.parentElement.style.overflow = 'hidden';
            cssRules += 
                `.${uniqueClass} {
                    animation: float-animation-${item.id} ${animationDuration}s linear infinite;
                    white-space: nowrap;
                }
                @keyframes float-animation-${item.id} {
                    0% { transform: translateX(0); opacity: 1; }
                    25% { transform: translateX(0); opacity: 1; }
                    50% { transform: translateX(-${textOverflow}px); opacity: 1; }
                    75% { transform: translateX(-${textOverflow}px); opacity: 1; }
                    100% { transform: translateX(0); opacity: 1; }
                }
            `;
        }
    });
    const existingStyles = document.querySelectorAll('style');
    existingStyles.forEach(existingStyle => {
        if (existingStyle.innerText.includes("float-animation")) {
            existingStyle.remove();
        }
    });
    style.innerText = cssRules;
    document.head.appendChild(style);
}

export { setAnimationForText }