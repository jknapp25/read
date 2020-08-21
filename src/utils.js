export { enrich, indexes, isInViewport, getCurrentPosition };

function enrich(htmlString, furthestPosition) {
  let count = 0;
  const enrichedString = htmlString.replace(/(<p>)/g, () => {
    ++count;
    if (count === furthestPosition) {
      return `<div id="new-content-line" class="text-success position-absolute" style="transform: translate(-45px, -13px);">New</div><hr><p class="content-anchor">`;
    } else {
      return `<p class="content-anchor">`;
    }
  });
  return enrichedString;
}

function indexes(source, find) {
  if (!source) return [];
  if (!find) return source.split("").map((_, i) => i);

  let result = [];
  for (let i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) === find) {
      result.push(i);
    }
  }
  return result;
}

function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getCurrentPosition() {
  let furthestPos = 1;
  const elements = document.getElementsByClassName("content-anchor");

  if (elements.length) {
    for (let i = 1; i < elements.length; i++) {
      const inViewport = isInViewport(elements[i]);
      if (inViewport && i > furthestPos) {
        furthestPos = i;
      }
    }
  }

  return furthestPos;
}
