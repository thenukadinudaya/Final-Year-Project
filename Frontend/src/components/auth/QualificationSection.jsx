import { useState, useEffect } from "react";

const SKILL_DATA = {
  "Programming Languages": ["Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Kotlin", "Swift"],
  "Web Development": ["HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express.js", "Next.js", "Tailwind CSS"],
  "Backend & APIs": ["REST API", "GraphQL", "Django", "Flask", "Spring Boot", "ASP.NET"],
  "Databases": ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis"],
  "Data & AI": ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Data Analysis", "Machine Learning", "Deep Learning", "NLP (Natural Language Processing)"],
  "DevOps & Cloud": ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Jenkins", "Linux", "Bash", "AWS", "Azure", "Google Cloud"],
  "Tools & Collaboration": ["Git", "GitHub", "GitLab", "Jira", "Agile", "Scrum"],
  "Cybersecurity": ["Network Security", "Penetration Testing", "Ethical Hacking", "Cryptography"],
  "Mobile Development": ["Android Development", "iOS Development", "Flutter", "React Native"],
  "Testing": ["Unit Testing", "Integration Testing", "Selenium", "Cypress"]
};

export default function QualificationSection({ initialData, onQualificationsChange }) {
  const [education, setEducation] = useState(initialData?.education || []);
  const [certifications, setCertifications] = useState(initialData?.certifications || []);
  
  // Keep internal state in sync with parent initialData
  useEffect(() => {
    if (initialData) {
      setEducation(initialData.education || []);
      setCertifications(initialData.certifications || []);
    }
  }, [initialData]);
  
  const [editingEdId, setEditingEdId] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);

  // Temporary selection state for dropdowns
  const [tempSelection, setTempSelection] = useState({ field: "", skill: "" });

  const levels = ["Secondary Education", "Vocational/Diplomas", "Undergraduate", "Postgraduate"];

  const notifyParent = (ed, cert) => {
    // Aggregate all skills into one field
    const allSkills = new Set();
    ed.forEach(item => {
        if (Array.isArray(item.skills)) {
            item.skills.forEach(s => allSkills.add(s));
        }
    });
    cert.forEach(item => {
        if (item.skill) allSkills.add(item.skill);
    });

    if (onQualificationsChange) {
      onQualificationsChange({ 
        education: ed, 
        certifications: cert,
        all_skills: Array.from(allSkills) 
      });
    }
  };

  const addEducation = () => {
    const id = Date.now();
    const newEd = { id, level: "", skills: [], documents: [] };
    const updated = [...education, newEd];
    setEducation(updated);
    setEditingEdId(id);
    setTempSelection({ field: "", skill: "" });
    notifyParent(updated, certifications);
  };

  const updateEducation = (id, fields) => {
    const updated = education.map(item => item.id === id ? { ...item, ...fields } : item);
    setEducation(updated);
    notifyParent(updated, certifications);
  };

  const addSkillToEducation = (id, skill) => {
    if (!skill) return;
    const item = education.find(e => e.id === id);
    if (item && !item.skills.includes(skill)) {
        updateEducation(id, { skills: [...item.skills, skill] });
    }
    setTempSelection({ ...tempSelection, skill: "" });
  };

  const removeSkillFromEducation = (id, skill) => {
    const item = education.find(e => e.id === id);
    if (item) {
        updateEducation(id, { skills: item.skills.filter(s => s !== skill) });
    }
  };

  const addCertification = () => {
    const id = Date.now();
    const newCert = { id, name: "", skill: "", documents: [] };
    const updated = [...certifications, newCert];
    setCertifications(updated);
    setEditingCertId(id);
    setTempSelection({ field: "", skill: "" });
    notifyParent(education, updated);
  };

  const updateCertification = (id, fields) => {
    const updated = certifications.map(item => item.id === id ? { ...item, ...fields } : item);
    setCertifications(updated);
    notifyParent(education, updated);
  };

  const handleFileUpload = (list, setList, id, event, category) => {
    const files = Array.from(event.target.files || []);
    const updated = list.map(item => item.id === id ? { ...item, documents: files } : item);
    setList(updated);
    if (category === 'ed') notifyParent(updated, certifications);
    else notifyParent(education, updated);
  };

  return (
    <div className="space-y-8">
      {/* --- EDUCATION SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">Education</h3>
          <button type="button" onClick={addEducation} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Level
          </button>
        </div>

        <div className="space-y-3">
          {education.map((item) => (
            <div key={item.id} className={`border rounded-xl transition-all ${editingEdId === item.id ? 'border-blue-500 ring-2 ring-blue-50 bg-white' : 'border-gray-200 bg-gray-50/50'}`}>
              {editingEdId === item.id ? (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={item.level}
                      onChange={(e) => updateEducation(item.id, { level: e.target.value })}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Education Level</option>
                      {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  {/* Two-step skill selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Add Skills</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                            value={tempSelection.field}
                            onChange={(e) => setTempSelection({ field: e.target.value, skill: "" })}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Field/Category</option>
                            {Object.keys(SKILL_DATA).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <select
                            value={tempSelection.skill}
                            disabled={!tempSelection.field}
                            onChange={(e) => addSkillToEducation(item.id, e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        >
                            <option value="">Select Skill</option>
                            {tempSelection.field && SKILL_DATA[tempSelection.field].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {/* Selected Skill Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {item.skills.map(s => (
                            <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1">
                                {s}
                                <button type="button" onClick={() => removeSkillFromEducation(item.id, s)} className="hover:text-blue-900 text-lg leading-none">&times;</button>
                            </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-xs font-medium transition-colors">
                      <svg className={`w-4 h-4 ${item.documents?.length > 0 ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      {item.documents?.length > 0 ? `${item.documents.length} File(s)` : 'Attach proof'}
                      <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(education, setEducation, item.id, e, 'ed')} />
                    </label>
                    <button type="button" onClick={() => setEditingEdId(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm">Done</button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 flex items-center justify-between group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{item.level || 'Level'}</div>
                    <div className="flex gap-1 flex-wrap overflow-hidden">
                        {item.skills.length > 0 ? item.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">{s}</span>
                        )) : <span className="italic text-gray-400 text-xs">No skills selected</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => { setEditingEdId(item.id); setTempSelection({ field: "", skill: "" }); }} className="text-blue-600 hover:text-blue-800 text-xs font-bold">EDIT</button>
                    <button type="button" onClick={() => removeEducation(item.id)} className="text-red-600 hover:text-red-800 text-xs font-bold">REMOVE</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- CERTIFICATIONS SECTION --- */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
          <button type="button" onClick={addCertification} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Cert
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map((item) => (
            <div key={item.id} className={`border rounded-xl transition-all ${editingCertId === item.id ? 'border-blue-500 ring-2 ring-blue-50 bg-white' : 'border-gray-200 bg-gray-50/50'}`}>
              {editingCertId === item.id ? (
                <div className="p-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Certification Name (e.g. AWS Certified Developer)"
                    value={item.name}
                    onChange={(e) => updateCertification(item.id, { name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                            value={tempSelection.field}
                            onChange={(e) => setTempSelection({ field: e.target.value, skill: "" })}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Field for Skill</option>
                            {Object.keys(SKILL_DATA).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <select
                            value={item.skill}
                            disabled={!tempSelection.field}
                            onChange={(e) => updateCertification(item.id, { skill: e.target.value })}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        >
                            <option value="">Select Primary Skill</option>
                            {tempSelection.field && SKILL_DATA[tempSelection.field].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-xs font-medium transition-colors">
                      <svg className={`w-4 h-4 ${item.documents?.length > 0 ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      {item.documents?.length > 0 ? `${item.documents.length} File(s)` : 'Attach proof'}
                      <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(certifications, setCertifications, item.id, e, 'cert')} />
                    </label>
                    <button type="button" onClick={() => setEditingCertId(null)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm">Done</button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 flex items-center justify-between group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase tracking-tighter">CERT</div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name || 'Untitled Certification'}</p>
                        {item.skill && <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">SKILL: {item.skill}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => { setEditingCertId(item.id); setTempSelection({ field: "", skill: "" }); }} className="text-blue-600 hover:text-blue-800 text-xs font-bold">EDIT</button>
                    <button type="button" onClick={() => removeCertification(item.id)} className="text-red-600 hover:text-red-800 text-xs font-bold">REMOVE</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
