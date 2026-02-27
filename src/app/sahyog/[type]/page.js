"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function SahyogPage() {
    const params = useParams();
    const type = params.type; // beti_vivah / untimely_death

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");
    // const [districts, setDistricts] = useState([]);
    // const [blocks, setBlocks] = useState([]);

    // Fetch donations
    const fetchDonations = async () => {
        if (!type) return;
        setLoading(true);

        let query = `/api/donation/by-type?type=${type}`;
        if (district) query += `&district=${district}`;
        if (block) query += `&block=${block}`;

        const res = await axios.get(query);
        setDonations(res.data.donations || []);
        setLoading(false);

        // Fill dropdowns dynamically
        // const uniqueDistricts = [...new Set(res.data.donations.map(d => d.donorDistrict))];
        // const uniqueBlocks = [...new Set(res.data.donations.map(d => d.donorBlock))];
        // setDistricts(uniqueDistricts);
        // setBlocks(uniqueBlocks);
    };

    useEffect(() => {
        fetchDonations();
    }, [type, district, block]);
    const approvedDonations = donations.filter(
        (d) => d.status === "founder_approved"
    );
    //  UPDATED: District dropdown from approved donations only
    const districts = [
        ...new Set(approvedDonations.map((d) => d.donorDistrict)),
    ];

    //  UPDATED: Block dropdown from approved donations only
    const blocks = [
        ...new Set(approvedDonations.map((d) => d.donorBlock)),
    ];
    if (!type) return <p>Loading type...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "beti_vivah" ? "Beti Vivah Sahyog Suchi" : "Untimely Death Sahyog Suchi"}
            </h2>

            {/* Filters */}

            <div className="row mb-4 g-3">
                <div className="col-md-2">
                    <label className="form-label fw-semibold">
                        District
                    </label>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Districts</option>
                        {districts.map((d, idx) => (
                            <option key={idx} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="form-label fw-semibold">
                        Block
                    </label>
                    <select
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Blocks</option>
                        {blocks.map((b, idx) => (
                            <option key={idx} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            {/* Table */}
            {loading ? (
                <p>Loading donations...</p>
            ) : approvedDonations.length === 0 ? (
                <p>No donations found for this selection.</p>
            ) : (
                <div className="bg-white p-3 rounded shadow-sm border">

                    <div className="table-responsive ">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th>Donor</th>
                                    <th>Avedan</th>
                                    <th>Amount</th>
                                    <th>Sahyog Date</th>
                                    <th>Status</th>
                                    <th>District</th>
                                    <th>Block</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedDonations.map((d, idx) => (
                                    <tr key={idx}>
                                        <td>{d.donorName}</td>
                                        <td>{d.avedanTitle}</td>
                                        <td>{d.amount}</td>
                                        <td>{new Date(d.donatedAt).toLocaleDateString()}</td>
                                        <td>{d.status}</td>
                                        <td>{d.donorDistrict}</td>
                                        <td>{d.donorBlock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )}
        </div>
    );
}
