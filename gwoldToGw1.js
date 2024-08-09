function convertGwoldToGw1(oldContent) {
    // Replace the custom delimiters with standard JS syntax
    let jsContent = oldContent
        .replace(/∆/g, " ")
        .replace(/₮/g, "\n")
        .replace(/₰/g, "{\n")
        .replace(/⨫/g, "}\n");
    
    // Remove any trailing/leading whitespace from each line
    jsContent = jsContent
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    
    // Replace unnecessary/incorrect formatting
    jsContent = jsContent.replace(/forever\s*\(\)\s*{/, 'function forever() {');

    let arr = jsContent.split("௹");

    let title = arr[0];
    jsContent = arr[1];
    
    // Wrap the JS content in a valid Gear Works format (if needed)
    let convertedContent = `⇇!DOCTYPE⇔gw1⇉
⇇META⇔Old File Type⇉
⇇TITLE⇔${title}⇔gw_user⇉
⇇JSCONTENT⇔
${jsContent}
⇉⇇END⇉`;

    return convertedContent;
}
