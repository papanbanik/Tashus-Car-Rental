export const styleTitle = (title: string) => {
  const words = title.split(' ');

  if (words.length <= 3) {
    return words.join(' ');
  }

  return (
    <>
      <span className="text-primary">{words[0]} </span>
      <span className="text-black">{words.slice(1, -1).join(' ')} </span>
      <span className="text-primary">{words[words.length - 1]}</span>
    </>
  );
};
