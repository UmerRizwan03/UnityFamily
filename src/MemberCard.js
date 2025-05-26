import React from 'react';

// Receive onEdit and onDelete handlers as props
const MemberCard = ({ member, onEdit, onDelete }) => {
  // const placeholderImage = `https://source.unsplash.com/300x300/?portrait,${member.role ? member.role.toLowerCase() : 'person'}`;
  const placeholderImage = '/placeholder.png'; // Example: if you add a local placeholder in your public folder
  const fallbackImage = 'https://via.placeholder.com/300'; // Use a generic placeholder if no image is available


  return (
    <div className="bg-neutral-800 p-6 rounded-xl shadow-2xl hover:shadow-glow-accent-primary transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center text-center w-full max-w-xs mx-auto">
      <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-accent-primary mb-3 shadow-md">
        <img
          // src={member.image || placeholderImage}
          // Temporarily remove or use a safe local placeholder
          // src={member.image || placeholderImage} // Or remove src entirely for now if no local placeholder
          src={member.image_url || placeholderImage} // Use member.image_url, fallback to placeholder
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }} // Fallback for broken image links
        />
      </div>
      <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-accent-secondary text-sm mb-1">{member.role}</p>
      {member.birth_date && <p className="text-neutral-400 text-xs">Born: {new Date(member.birth_date).toLocaleDateString()}</p>}
      {/* Removed death date display */}
      {/* Add more details as needed */}
      <div className="flex space-x-4 mt-4">
        {/* Add Edit Button */}
        <button
          onClick={() => onEdit(member)} // Call onEdit with the member data
          className="px-4 py-2 border border-accent-primary text-accent-primary rounded-full text-sm font-semibold hover:bg-accent-primary/10 transition-colors duration-200"
        >
          Edit
        </button>
        {/* Add Delete Button */}
        <button
          onClick={() => onDelete(member.id)} // Call onDelete with the member ID
          className="px-4 py-2 border border-danger text-danger rounded-full text-sm font-semibold hover:bg-danger/10 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MemberCard;