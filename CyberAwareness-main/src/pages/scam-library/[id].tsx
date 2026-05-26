import { useParams } from 'react-router-dom';
import { getScamById } from '../../data/scamDatabase';
import ScamDetail from '../../components/scam-library/ScamDetail';

export default function ScamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const scam = getScamById(id || '');

  if (!scam) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Scam Not Found</h1>
          <p className="text-slate-500">The scam you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ScamDetail scam={scam} />;
}
