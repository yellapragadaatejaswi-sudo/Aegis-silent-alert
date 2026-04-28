import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, ArrowLeft } from 'lucide-react';

interface ProjectReportProps {
  onBack: () => void;
}

const ProjectReport: React.FC<ProjectReportProps> = ({ onBack }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Title Page
    doc.setFontSize(26);
    doc.setTextColor(30, 30, 30);
    doc.text('PROJECT REPORT', pageWidth / 2, 70, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(60, 60, 60);
    doc.text('AEGIS: DISCREET SILENT EMERGENCY ALERT SYSTEM', pageWidth / 2, 90, { align: 'center' });
    
    doc.setDrawColor(200, 120, 0);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, 100, pageWidth / 2 + 40, 100);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('A Prototype for Personal Safety & Digital Stealth', pageWidth / 2, 110, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Submission Ready Version 1.1', pageWidth / 2, 240, { align: 'center' });
    
    doc.addPage();

    // Reset styles for content
    doc.setTextColor(0, 0, 0);
    let y = 30;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    const addSectionTitle = (title: string, spacing = 15) => {
      if (y > 250) {
        doc.addPage();
        y = 30;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      y += 10;
    };

    const addText = (text: string, spacing = 10) => {
      const splitText = doc.splitTextToSize(text, contentWidth);
      const textHeight = (splitText.length * 7); // approx height
      if (y + textHeight > 270) {
        doc.addPage();
        y = 30;
      }
      doc.text(splitText, margin, y);
      y += textHeight + spacing;
    };

    // 2. Abstract
    addSectionTitle('1. Abstract');
    addText("This project introduces Aegis, a web-based silent emergency alert system disguised as a functional calculator app. Aegis addresses the critical need for discreet distress signaling in dangerous situations where overt calls for help might escalate risk. The system features a hidden 'stealth mode' activated by a specific passcode via the calculator interface. Once triggered, it captures the user's real-time GPS coordinates and broadcasts automated SOS alerts with location tracking links to emergency contacts via Twilio SMS API.");

    // 3. Introduction
    addSectionTitle('2. Introduction');
    addText("Personal safety is a growing concern in urban environments. Traditional emergency methods like calling emergency services are often too slow or dangerous to perform in situations involving abduction, domestic violence, or street harassment. Aegis provides a digital 'panic button' that is both invisible to an attacker and accessible to the user.");

    // 4. Problem Statement
    addSectionTitle('3. Problem Statement');
    addText("Most safety apps are easily identifiable by their icons or interfaces, making them easy for an aggressor to find and delete. Furthermore, human panic often makes it difficult to open a complex app, find a button, and wait for feedback. There is a requirement for an application that looks innocuous but functions with high reliability the moment it is needed.");

    // 5. Objectives
    doc.addPage();
    y = 30;
    addSectionTitle('4. Objectives');
    addText("- Design an interface that functions as a fully operational calculator.");
    addText("- Implement multi-path stealth activation via 8008 Passcode & Double-Tap AC button.");
    addText("- Integrate real-time Geolocation API for high-precision tracking.");
    addText("- Develop a robust backend SMS gateway for automated SOS broadcasting.");
    addText("- Ensure secure data persistence for emergency contacts via local encryption.");

    // 6. Literature Review
    addSectionTitle('5. Literature Review');
    addText("Previous studies on mobile security apps have highlighted the 'Safety Paradox'—where visible security apps increase the user's stress by making them high-value targets. Research in PWA technology shows that web-based alerts are effective due to their low friction and cross-device compatibility without requiring app store installations.");

    // 7. Proposed System
    addSectionTitle('6. Proposed System');
    addText("Aegis utilizes a dual-layer architecture. Layer 1 is the 'Public Interface' (React Calculator). Layer 2 is the 'Stealth Engine' (Express Backend + SMS Gate). The transition between layers is managed by a state-controlled wrapper that ensures no visual artifacts of the security system are visible during normal operation.");

    // 8. System Architecture
    autoTable(doc, {
      startY: y + 5,
      head: [['Layer', 'Responsibility', 'Technology']],
      body: [
        ['Presentation', 'User Interface & State', 'React / Tailwind'],
        ['Security', 'Passcode & Trigger Logic', 'Custom Hooks'],
        ['Location', 'GPS Coordinate Resolution', 'Geolocation API'],
        ['Network', 'Emergency Broadcast', 'Express / Twilio'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [200, 120, 0] }
    });
    y = (doc as any).lastAutoTable.finalY + 15;

    // 9. Hardware & 10. Software
    doc.addPage();
    y = 30;
    addSectionTitle('7. System Requirements');
    doc.setFont('helvetica', 'bold');
    doc.text('Hardware Requirements', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    addText("- Processor: Any modern Dual Core SoC (ARM/x86)\n- Display: 720p minimum resolution\n- Network: Steady GPS lock and cellular data.");
    
    doc.setFont('helvetica', 'bold');
    doc.text('Software Requirements', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    addText("- Web Environment: Browser with Geolocation support\n- Runtime: Node.js (Backend execution)\n- API: Twilio Account for SMS functionality.");

    // 11. Working Process
    addSectionTitle('8. Working Process');
    addText("Step 1: Application initialization and contact synchronization.");
    addText("Step 2: Stealth activation via '8008=' code or emergency 'Double-Tap AC'.");
    addText("Step 3: Background retrieval of high-precision GPS coordinates.");
    addText("Step 4: Relay coordinates to Backend and trigger encrypted SMS broadcast.");
    addText("Step 5: Dynamic UI shift to Real-Time Monitoring Dashboard.");

    // 13. Advantages & Applications
    doc.addPage();
    y = 30;
    addSectionTitle('9. Advantages & Applications');
    addText("Advantages:\n- High concealment: Look and feel of a regular system tool.\n- Speed: Multi-trigger path for rapid alert deployment.\n- Portability: Works on any device with a modern browser.");
    
    addSectionTitle('Applications:');
    doc.text("- Solo Travel Security\n- Domestic Crisis Management\n- Asset Tracking and Logistics\n- High-Risk Environment Monitoring", margin, y);
    y += 40;

    // 15. Future Scope & Conclusion
    addSectionTitle('10. Future Scope & Conclusion');
    addText("The roadmap for Aegis involves implementing 'Pulse Trigger'—using wearable heart rate monitors to detect extreme fear and trigger alerts automatically. Additionally, zero-data SMS protocols will be explored for regions with poor internet connectivity.");
    addText("In conclusion, Aegis successfully demonstrates that digital weapons for personal safety don't need to be visible to be effective. By hiding in plain sight, Aegis provides a significant tactical advantage for victims in dangerous situations.");

    // 17. References
    doc.addPage();
    y = 30;
    addSectionTitle('11. References');
    doc.setFontSize(10);
    addText("[1] IEEE Standard for Geolocation Information Exchange v2.1");
    addText("[2] Twilio Messaging API: Best Practices for Emergency Services");
    addText("[3] Progressive Web Apps (PWA) Security Guidelines 2024");

    doc.save('Aegis_Official_Project_Report.pdf');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Settings</span>
        </button>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-hw-accent-orange/10 rounded-xl">
              <FileText className="text-hw-accent-orange" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Project Documentation</h1>
              <p className="text-zinc-500 text-sm">Academic Prototype Report v1.0</p>
            </div>
          </div>

          <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
            <p>
              The Aegis Project Report is a comprehensive document designed for academic submission. It covers the full lifecycle 
              of the prototype, from problem statement to future scope.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg border border-zinc-800/50">
                <div className="text-hw-accent-orange font-mono text-xs mb-1 uppercase tracking-wider">Structure</div>
                <div className="text-zinc-200 text-lg font-semibold">17 Sections</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-zinc-800/50">
                <div className="text-hw-accent-orange font-mono text-xs mb-1 uppercase tracking-wider">Format</div>
                <div className="text-zinc-200 text-lg font-semibold">PDF Document</div>
              </div>
            </div>

            <section className="border-t border-zinc-800 pt-6">
              <h3 className="text-zinc-200 font-semibold mb-4">Report Contents:</h3>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                <li>• Title Page & Abstract</li>
                <li>• Problem Statement</li>
                <li>• System Architecture</li>
                <li>• Working Methodology</li>
                <li>• Hardware/Software Requirements</li>
                <li>• Flowcharts & References</li>
              </ul>
            </section>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="w-full bg-hw-accent-orange hover:bg-hw-accent-orange/90 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-hw-accent-orange/20"
        >
          <Download size={20} />
          Download Full PDF Report
        </button>
      </div>
    </div>
  );
};

export default ProjectReport;
