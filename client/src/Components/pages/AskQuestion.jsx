import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../../Hooks/useAuthContext";
import classes from "../../Styles/AskQuestion.module.css";
import UserApi from "../../apis/UserApi";
import { Button } from "../Buttons";
import { useNavigate } from "react-router-dom";
import TitleInput from "../questions/TitleInput";
import DescriptionInput from "../questions/DescriptionInput";
import ImageInputAndViewer from "../questions/ImageInputAndViewer";
import TagInput from "../questions/TagInput";

const AskQuestion = () => {
    // Text Input Section
    const [title, setTitle] = useState("");
    const [textContent, setTextContent] = useState("");

    // Image Input Section
    const [selectedImage, setSelectedImage] = useState([]);
    const [imageViewer, setImageViewer] = useState([]);
    const imageInputRef = useRef(null);
    const [fileError, setFileError] = useState(false);

    // Tags Input Section
    const [tagList, setTagList] = useState([]);
    const [tag, setTag] = useState("");

    // Submit Section
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        toast.onChange((payload) => {
            if (payload.status === "removed") {
                setLoading(false);
                navigate("/");
            }
        });
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        if (!tagList.length) {
            setError("Please select add at least 1 tag");
            setLoading(false);
            return;
        }
        console.log("TEXT: ", textContent);
        console.log("IMAGEs ", selectedImage);
        console.log("TAGLIST: ", tagList);

        const formData = new FormData();
        formData.append("textContent", textContent);
        for (let i = 0; i < selectedImage.length; i++) {
            formData.append("images", selectedImage[i]);
        }

        // Append each tag to the formData
        for (let i = 0; i < tagList.length; i++) {
            formData.append("tagList", tagList[i]);
        }

        try {
            const response = await UserApi.post("/add-question", formData, {
                headers: {
                    Authorization: `Bearer ${user}`,
                },
            });
            setLoading(false);

            toast.success(
                "Question Added Successfully !! Navigating to home page...",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500,
                }
            );
            console.log("ASK QUESTION Response: ", response.data);
        } catch (err) {
            console.log("ASK QUESTION ERROR: ", err);
            setLoading(false);
            setError(err.response.data.error);
        }
    };

    return (
        <>
            <div className={`${classes["AskQuestion"]}`}>
                <div className={`${classes["page-header"]} global-page-header`}>
                    <h2>Ask a Question</h2>
                </div>

                <TitleInput title={title} setTitle={setTitle} />
                {/* Text Box Section */}
                <DescriptionInput
                    textContent={textContent}
                    setTextContent={setTextContent}
                />

                {/* Image Attachment  */}
                <ImageInputAndViewer
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    imageViewer={imageViewer}
                    setImageViewer={setImageViewer}
                    imageInputRef={imageInputRef}
                    fileError={fileError}
                    setFileError={setFileError}
                />

                {/* Tags Section  */}
                <TagInput
                    tagList={tagList}
                    setTagList={setTagList}
                    tag={tag}
                    setTag={setTag}
                />

                {fileError && (
                    <p style={{ color: "red" }}>
                        Only jpeg, jpg and png files allowed
                    </p>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {/* Submit Button */}
                <div className={`${classes["submit-btn"]}`}>
                    <Button func={handleSubmit} text="Confirm Post" />
                </div>
            </div>
            <ToastContainer position="top-right" />
        </>
    );
};

export default AskQuestion;
