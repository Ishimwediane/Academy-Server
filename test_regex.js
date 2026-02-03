// Test the regex pattern
const testLine = "![Screenshot 1](https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135404/gmail_homepage_1770046905287_an4n5q.jpg)";

const imageMatch = testLine.match(/!\[([^\]]*)\]\(([^)]+)\)/);

if (imageMatch) {
    console.log('✓ Regex matched!');
    console.log('Full match:', imageMatch[0]);
    console.log('Alt text:', imageMatch[1]);
    console.log('Image URL:', imageMatch[2]);
} else {
    console.log('✗ Regex did not match');
}

// Test with the actual format from database
const dbLine = "![Screenshot 1](https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135404/gmail_homepage_1770046905287_an4n5q.jpg)";
const match2 = dbLine.match(/!\[([^\]]*)\]\(([^)]+)\)/);
console.log('\nDatabase format test:', match2 ? '✓ Match' : '✗ No match');
