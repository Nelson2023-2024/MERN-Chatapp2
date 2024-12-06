import { useRef, useState } from "react";
import { Image, Send, X, Smile } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageImput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef(null);

  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    // get the files that user selected
    const file = e.target.files[0];

    //if type of the file is not an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    //if user selected an image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlesendMessage = async (e) => {
    e.preventDefault();

    //if the input is empty and no image is selected
    if (!text.trim() && !imagePreview) return;

    //but if the message exists
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      //vlear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Error sending the message");
      console.error("Failed to send message", error);
    }
  };

  // toggleEmojiPicker
  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prevText) => prevText + emojiData.emoji);
    //keep the emoji picker open after selcting an image
    setIsEmojiPickerOpen(true);
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handlesendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className="btn btn-circle btn-sm text-zinc-400 hover:text-emerald-500 relative top-2"
          >
            <Smile size={20} />
          </button>

          {isEmojiPickerOpen && (
            <div className="absolute bottom-12 left-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
              <X size={28} className="absolute right-0 top-0 cursor-pointer " onClick={toggleEmojiPicker}/>
            </div>
          )}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* to select image from our machine */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="button"
          className={`btn btn-sm btn-circle `}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageImput;
