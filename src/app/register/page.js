"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// Yup validation schema
const schema = yup.object({
  name: yup.string().required("नाम आवश्यक है"),
  email: yup.string().email("सही ईमेल डालें").required("ईमेल आवश्यक है"),
  password: yup.string().min(6, "कम से कम 6 अक्षर").required("पासवर्ड आवश्यक है"),
  mobile: yup.string().required("मोबाइल नंबर आवश्यक है"),
  transactionId: yup.string().required("ट्रांजेक्शन आईडी आवश्यक है"),
  referralCode: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .matches(/^\d{8}$/, {
      message: "8 अंकों का रेफरल कोड डालें",
      excludeEmptyString: true,
    })
    .notRequired(),
  adharNumber: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .matches(/^\d{12}$/, {
      message: "आधार नंबर 12 अंकों का होना चाहिए",
      excludeEmptyString: true,
    })
    .notRequired(),
  acceptTerms: yup.boolean().oneOf([true], "नियम स्वीकार करें"),
});

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // REQUIRED
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("mobile", data.mobile);
      formData.append("transactionId", data.transactionId);
      formData.append("acceptTerms", data.acceptTerms);

      // OPTIONAL
      if (data.referralCode?.trim()) {
        formData.append("referralCode", data.referralCode.trim());
      }

      if (data.adharNumber?.trim()) formData.append("adharNumber", data.adharNumber.trim());
      if (data.fatherorhusbandname) formData.append("fatherorhusbandname", data.fatherorhusbandname);
      if (data.dob) formData.append("dob", data.dob);
      if (data.gender) formData.append("gender", data.gender);
      if (data.occupation) formData.append("occupation", data.occupation);
      if (data.governmentDepartment) formData.append("governmentDepartment", data.governmentDepartment);
      if (data.officeNameAddress) formData.append("officeNameAddress", data.officeNameAddress);
      if (data.state) formData.append("state", data.state);
      if (data.district) formData.append("district", data.district);
      if (data.permanentAddress) formData.append("permanentAddress", data.permanentAddress);
      if (data.nomineeName) formData.append("nomineeName", data.nomineeName);
      if (data.nomineeRelation) formData.append("nomineeRelation", data.nomineeRelation);
      if (data.nomineeMobile) formData.append("nomineeMobile", data.nomineeMobile);

      if (data.paymentReceipt?.[0]) formData.append("paymentReceipt", data.paymentReceipt[0]);

      await axios.post("/api/auth/register", formData);

      toast.success("पंजीकरण सफल हुआ");
      router.push("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "पंजीकरण असफल");
    }
  };

  return (
    <div className="container my-5">
      <div className="mx-auto p-4 border rounded shadow bg-white" style={{ maxWidth: "1000px" }}>
        <h4 className="text-center mb-4">नया पंजीकरण</h4>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">

          {/* Name & Email */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">पूरा नाम</label>
              <input className="form-control" placeholder="पूरा नाम" {...register("name")} />
              <p className="text-danger">{errors.name?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">ईमेल आईडी</label>
              <input className="form-control" placeholder="ईमेल आईडी" {...register("email")} />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
          </div>

          {/* Father/Husband & DOB */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">पिता / पति का नाम</label>
              <input className="form-control" placeholder="पिता / पति का नाम" {...register("fatherorhusbandname")} />
            </div>
            <div className="col-md-6">
              <label className="form-label">जन्मतिथि</label>
              <input type="date" className="form-control" {...register("dob")} />
            </div>
          </div>

          {/* Mobile & Gender */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">मोबाइल नंबर</label>
              <input className="form-control" placeholder="मोबाइल नंबर" {...register("mobile")} />
              <p className="text-danger">{errors.mobile?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">लिंग</label>
              <select className="form-control" {...register("gender")}>
                <option value="">लिंग चुनें</option>
                <option value="male">पुरुष</option>
                <option value="female">महिला</option>
                <option value="other">अन्य</option>
              </select>
            </div>
          </div>

          {/* Occupation & Department */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">व्यवसाय</label>
              <select className="form-control" {...register("occupation")}>
                <option value="">व्यवसाय चुनें</option>
                <option value="government">सरकारी नौकरी</option>
                <option value="private">प्राइवेट नौकरी</option>
                <option value="business">व्यवसाय</option>
                <option value="agriculture">कृषि</option>
                <option value="housewife">गृहिणी</option>
                <option value="student">छात्र</option>
                <option value="contract">संविदा कर्मी</option>
                <option value="public_representative">जन प्रतिनिधि</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">सरकारी विभाग (यदि हो)</label>
              <input className="form-control" placeholder="सरकारी विभाग" {...register("governmentDepartment")} />
            </div>
          </div>

          {/* Aadhaar & Office */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">आधार नंबर</label>
              <input className="form-control" placeholder="12 अंकों का आधार नंबर(यदि हो)"  {...register("adharNumber")} />
              <p className="text-danger">{errors.adharNumber?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">कार्यालय का नाम व पता</label>
              <input className="form-control" placeholder="कार्यालय का नाम व पता" {...register("officeNameAddress")} />
            </div>
          </div>

          {/* State & District */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">राज्य</label>
              <input className="form-control" placeholder="राज्य" {...register("state")} />
            </div>
            <div className="col-md-6">
              <label className="form-label">जिला</label>
              <input className="form-control" placeholder="जिला" {...register("district")} />
            </div>
          </div>

          {/* Permanent Address */}
          <div className="mb-3">
            <label className="form-label">स्थायी पता</label>
            <textarea className="form-control" placeholder="स्थायी पता" {...register("permanentAddress")} />
          </div>

          {/* Nominee Fields */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">नामिनी का नाम</label>
              <input className="form-control" placeholder="नामिनी का नाम" {...register("nomineeName")} />
            </div>
            <div className="col-md-6">
              <label className="form-label">नामिनी से संबंध</label>
              <input className="form-control" placeholder="नामिनी से संबंध" {...register("nomineeRelation")} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">नामिनी मोबाइल नंबर</label>
              <input className="form-control" placeholder="नामिनी मोबाइल नंबर" {...register("nomineeMobile")} />
            </div>
            <div className="col-md-6">
              <label className="form-label">ट्रांजेक्शन आईडी</label>
              <input className="form-control" placeholder="ट्रांजेक्शन आईडी" {...register("transactionId")} />
              <p className="text-danger">{errors.transactionId?.message}</p>
            </div>
          </div>

          {/* Referral & Payment */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">रेफरल कोड (8 अंक) (यदि हो)</label>
              <input className="form-control" placeholder="रेफरल कोड" {...register("referralCode")} />
              <p className="text-danger">{errors.referralCode?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">भुगतान रसीद</label>
              <input type="file" className="form-control" {...register("paymentReceipt")} />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">पासवर्ड</label>
            <input type="password" className="form-control" placeholder="पासवर्ड" {...register("password")} />
            <p className="text-danger">{errors.password?.message}</p>
          </div>

          {/* Accept Terms */}
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" {...register("acceptTerms")} />
            <label className="form-check-label">मैं नियम व शर्तें स्वीकार करता हूँ </label>
            <p className="text-danger">{errors.acceptTerms?.message}</p>
          </div>

          <button className="globalBtnColor">Register</button>
        </form>
      </div>
    </div>
  );
}
