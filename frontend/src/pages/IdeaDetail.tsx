import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Rocket } from 'lucide-react';

const IdeaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [idea, setIdea] = useState<any>(null);
    const [promoting, setPromoting] = useState(false);

    useEffect(() => {
        if (!id) return;
        apiClient.get(`/ideas/${id}`).then(res => setIdea(res.data));
    }, [id]);

    const handlePromote = async () => {
        if (!window.confirm("Promote this idea to a full Project?")) return;
        setPromoting(true);
        try {
            const res = await apiClient.post(`/ideas/${id}/promote`);
            const newPid = res.data.new_project_id;
            navigate(`/projects/${newPid}`);
        } catch (e) {
            alert("Failed to promote idea");
            setPromoting(false);
        }
    };

    if (!idea) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 w-full">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft size={16} /> Back
            </button>

            <div className="bg-card border rounded-xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 bg-secondary rounded-full uppercase">{idea.status}</span>
                            <span className="text-xs px-2 py-1 bg-secondary rounded-full uppercase">{idea.origin}</span>
                        </div>
                    </div>
                    {idea.status === 'mature' && (
                        <button
                            onClick={handlePromote}
                            disabled={promoting}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Rocket size={18} /> {promoting ? 'Promoting...' : 'Promote to Project'}
                        </button>
                    )}
                </div>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Summary</h2>
                    <p className="text-muted-foreground leading-relaxed">{idea.summary}</p>
                </section>

                {/* Lineage Placeholder */}
                <section className="mb-8 border-t pt-8">
                    <h2 className="text-lg font-semibold mb-4">Lineage</h2>
                    <div className="h-40 bg-slate-50 rounded border flex items-center justify-center text-muted-foreground text-sm">
                        Graph Lineage Visualization (Concept -&gt; Idea)
                    </div>
                </section>

                {/* Evaluation Placeholder */}
                <section className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-muted/20 rounded border">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Novelty Score</div>
                        <div className="text-2xl font-bold">0.85</div>
                    </div>
                    <div className="p-4 bg-muted/20 rounded border">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Feasibility Score</div>
                        <div className="text-2xl font-bold">0.60</div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default IdeaDetail;
