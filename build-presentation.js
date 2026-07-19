const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Cấu hình các file đầu vào
const paths = {
  debai: path.join(__dirname, 'debai.md'),
  proposal: path.join(__dirname, 'EchoShield- UNESCO Youth Hackathon 2026 Proposal.md'),
  pho: path.join(__dirname, 'docs', 'ke_hoach_chien_luoc_pho_anh_hai.md'),
  pho3d: path.join(__dirname, 'docs', 'kien_truc_game_3d_genshin_style.md'),
  gdd: path.join(__dirname, 'docs', 'technical_architecture_gdd.md'),
  ch1: path.join(__dirname, 'docs', 'chapters', 'chapter_1_the_spark.md'),
  ch2: path.join(__dirname, 'docs', 'chapters', 'chapter_2_the_silent_treatment.md'),
  ch3: path.join(__dirname, 'docs', 'chapters', 'chapter_3_the_deepfake_nightmare.md'),
  ch4: path.join(__dirname, 'docs', 'chapters', 'chapter_4_the_breaking_point.md'),
  ch5: path.join(__dirname, 'docs', 'chapters', 'chapter_5_the_aftermath.md')
};

// Đọc và chuyển đổi markdown thông thường
function getHtmlContent(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      let markdown = fs.readFileSync(filePath, 'utf-8');
      
      // Tiền xử lý footnote definitions: [^1]: hoặc > [^1]:
      markdown = markdown.replace(/^(\s*>)?\s*\[\^(\d+)\]:\s*/gm, '$1 <span id="fn-$2"></span><a href="#fnref-$2" class="footnote-backref" title="Quay lại minh chứng">↩</a> **[$2]** ');
      
      // Tiền xử lý footnote references: [^1] (không có dấu hai chấm theo sau)
      markdown = markdown.replace(/\[\^(\d+)\](?!:)/g, '<sup><a href="#fn-$1" id="fnref-$1" class="footnote-ref">[$1]</a></sup>');

      return marked.parse(markdown);
    }
    return `<div class="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">Không tìm thấy file: ${filePath}</div>`;
  } catch (err) {
    return `<div class="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">Lỗi khi đọc file: ${err.message}</div>`;
  }
}

// Hàm render bong bóng hội thoại phong cách Novel Reader (Tối giản)
function renderDialogueBubbleHtml(speaker, action, speech, isMonologue) {
  const nameLower = speaker.toLowerCase();
  let speakerColor = 'text-indigo-600';
  if (nameLower.includes('shieldy')) {
    speakerColor = 'text-purple-600';
  } else if (nameLower.includes('vy')) {
    speakerColor = 'text-emerald-600';
  } else if (nameLower.includes('nam')) {
    speakerColor = 'text-blue-600';
  } else {
    speakerColor = 'text-slate-700';
  }
  
  const actionHtml = action ? `<span class="text-slate-400 italic font-normal text-xs md:text-sm">(${action})</span> ` : '';
  
  if (isMonologue) {
    return `<div class="novel-line monologue-line my-3 pl-4 border-l-2 border-slate-300">
      <span class="font-black text-slate-500 text-xs md:text-sm">${speaker} (Độc thoại):</span>
      ${actionHtml}
      <span class="text-slate-600 italic font-semibold text-xs md:text-sm">"${speech}"</span>
    </div>`;
  }
  
  return `<div class="novel-line dialogue-line my-2.5">
    <span class="font-black ${speakerColor} text-xs md:text-sm mr-1">${speaker}:</span>
    ${actionHtml}
    <span class="text-slate-800 font-semibold text-xs md:text-sm leading-relaxed">${speech}</span>
  </div>`;
}

// Hàm render danh sách lựa chọn (Tối giản)
function renderChoicesHtml(choices) {
  if (choices.length === 0) return '';
  
  let html = `<div class="my-4 p-4 bg-amber-50/40 border border-amber-200 rounded-xl flex flex-col gap-3">
    <span class="block text-[11px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5">
      <i data-lucide="help-circle" class="w-4 h-4 shrink-0"></i> Lựa chọn rẽ nhánh & Biến động chỉ số
    </span>
    <div class="flex flex-col gap-3">`;
    
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    const choiceNum = choice.num ? `<span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mr-1.5">Lựa chọn ${choice.num}:</span>` : '';
    
    // Parse chỉ số biến động thành các badge
    let badgesHtml = '';
    if (choice.stats) {
      const statsList = choice.stats.split(',');
      badgesHtml = '<div class="inline-flex flex-wrap gap-1.5 ml-2">';
      for (let j = 0; j < statsList.length; j++) {
        const stat = statsList[j].trim();
        let badgeColor = 'bg-rose-50 border-rose-200 text-rose-600';
        if ((stat.includes('+') && stat.includes('Trust')) || (stat.includes('-') && stat.includes('Stress')) || (stat.includes('-') && stat.includes('Viral'))) {
          badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-600';
        }
        badgesHtml += `<span class="px-1.5 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${badgeColor}">${stat}</span>`;
      }
      badgesHtml += '</div>';
    }
    
    let shieldyHtml = '';
    if (choice.shieldy) {
      shieldyHtml = `<p class="text-[11px] text-purple-600 italic font-semibold m-0 mt-1 pl-4 border-l border-purple-200">Shieldy: ${choice.shieldy}</p>`;
    }
    
    html += `<div class="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
      <div class="flex flex-wrap items-baseline">
        ${choiceNum}
        <span class="text-xs md:text-sm font-bold text-slate-900">${choice.text}</span>
        ${badgesHtml}
      </div>
      ${shieldyHtml}
    </div>`;
  }
  
  html += '</div></div>';
  return html;
}

// Hàm parser chính cho kịch bản Visual Novel (Novel Style)
function parseScriptToVisualNovelHtml(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let inScene = false;
  let inCharacterList = false;
  let inChoiceList = false;
  let currentChoices = [];
  
  function closeLists() {
    if (inCharacterList) {
      html += '</div></div>';
      inCharacterList = false;
    }
    if (inChoiceList) {
      html += renderChoicesHtml(currentChoices);
      currentChoices = [];
      inChoiceList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '') {
      continue;
    }
    
    // 1. Nhận diện tiêu đề chương
    const chapterMatch = line.match(/^\s*(?:[-*]\s+)?\*\*(Chapter \d+:\s*.*?)\*\*$/i) || line.match(/^\s*#\s*(Chapter \d+:\s*.*?)$/i);
    if (chapterMatch) {
      closeLists();
      html += `<div class="chapter-header-novel text-center py-4 my-6 border-y border-slate-300">
        <h2 class="text-lg md:text-xl font-black text-slate-900 uppercase tracking-widest m-0 px-4">${chapterMatch[1]}</h2>
      </div>`;
      continue;
    }
    
    // 2. Nhận diện Scene (Tối giản)
    const sceneMatch = line.match(/^\s*(?:#{2,4}\s*|\*?\*?)(SCENE_\d+(?::\s*.*)?)\*?\*?$/i);
    if (sceneMatch && sceneMatch[1].toUpperCase().includes('SCENE_')) {
      closeLists();
      if (inScene) {
        html += '</div>'; // Đóng scene-container trước đó
      }
      inScene = true;
      const fullTitle = sceneMatch[1];
      const colonIdx = fullTitle.indexOf(':');
      let sceneId = fullTitle;
      let sceneName = '';
      if (colonIdx !== -1) {
        sceneId = fullTitle.substring(0, colonIdx).trim();
        sceneName = fullTitle.substring(colonIdx + 1).trim();
      } else {
        sceneId = fullTitle.trim();
        sceneName = 'Bắt đầu phân cảnh';
      }
      
      html += `<div class="novel-scene-block border-b border-slate-100 py-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded">${sceneId}</span>
          <h3 class="text-sm md:text-base font-black text-slate-800 m-0">${sceneName}</h3>
        </div>`;
      continue;
    }
    
    // 3. Nhận diện Bối cảnh (BG) (Tối giản)
    const bgMatch = line.match(/^\s*(?:[-*]\s+)?\*?\*?Bối cảnh\s*\(BG\):?\*?\*?\s*(.*)$/i);
    if (bgMatch) {
      closeLists();
      html += `<p class="text-xs md:text-sm text-slate-500 font-bold leading-relaxed m-0 italic flex gap-1.5 items-center">
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
        <span>Bối cảnh: ${bgMatch[1]}</span>
      </p>`;
      continue;
    }
    
    // 4. Nhận diện Diễn biến kịch tính (Tối giản)
    const actionMatch = line.match(/^\s*(?:[-*]\s+)?\*?\*?Diễn biến kịch tính:?\*?\*?\s*(.*)$/i);
    if (actionMatch) {
      closeLists();
      html += `<p class="text-xs md:text-sm text-slate-600 font-bold leading-relaxed m-0 pl-3 border-l-2 border-slate-300">
        ${actionMatch[1]}
      </p>`;
      continue;
    }
    
    // 5. Nhận diện Sprites & Biểu cảm nhân vật (Tối giản)
    const spriteMatch = line.match(/^\s*(?:[-*]\s+)?\*?\*?Sprites\s*&\s*Biểu cảm(?:\s*nhân vật)?:?[\s*]*$/i);
    if (spriteMatch) {
      closeLists();
      inCharacterList = true;
      html += `<div class="my-1.5 text-xs text-slate-500 font-bold flex flex-wrap gap-x-3 gap-y-1 items-center">
        <span class="uppercase tracking-wider flex items-center gap-1"><i data-lucide="users" class="w-3 h-3"></i> Nhân vật:</span>`;
      continue;
    }
    
    // 6. Nhận diện Lựa chọn rẽ nhánh & Biến động chỉ số
    const choiceHeaderMatch = line.match(/^\s*(?:[-*]\s+)?\*?\*?Lựa chọn rẽ nhánh\s*&\s*(?:Biến động chỉ số|Biến động chỉ số:?)\*?\*?[\s*]*$/i);
    if (choiceHeaderMatch) {
      closeLists();
      inChoiceList = true;
      continue;
    }
    
    // 7. Nhận diện Thoại chi tiết header (bỏ qua)
    if (line.match(/^\s*(?:[-*]\s+)?\*?\*?Thoại chi tiết:?\*?\*?\s*$/i)) {
      closeLists();
      continue;
    }
    
    // 8. Nhận diện Độc thoại nội tâm và Thoại nhân vật
    const dialogueMatch = line.match(/^\s*(?:[-*]\s+)?\*\*(.*?)\*\*\s*(.*)$/);
    if (dialogueMatch) {
      closeLists();
      let speakerRaw = dialogueMatch[1].trim();
      const speechRaw = dialogueMatch[2].trim();
      
      // Xóa dấu hai chấm ở cuối speaker nếu có
      if (speakerRaw.endsWith(':')) {
        speakerRaw = speakerRaw.substring(0, speakerRaw.length - 1).trim();
      }
      
      const isMonologue = speakerRaw.toLowerCase().includes('độc thoại') || speakerRaw.toLowerCase().includes('nội tâm');
      
      let speaker = speakerRaw;
      let action = '';
      let speech = speechRaw;
      
      if (isMonologue) {
        const nameMatch = speakerRaw.match(/\((.*?)\)/);
        if (nameMatch) {
          speaker = nameMatch[1];
        } else {
          speaker = 'Độc thoại';
        }
        action = 'Độc thoại nội tâm';
      }
      
      const actionMatch = speechRaw.match(/^[\s*]*\((.*?)\)[\s*]*(.*)$/);
      if (actionMatch) {
        action = (action ? action + ' - ' : '') + actionMatch[1];
        speech = actionMatch[2];
      }
      
      if (isMonologue && !speech.startsWith('*')) {
        speech = `*${speech}*`;
      }
      
      speech = speech.replace(/^\*(.*?)\*$/, '$1');
      
      html += renderDialogueBubbleHtml(speaker, action, speech, isMonologue);
      continue;
    }
    
    // 9. Xử lý các mục danh sách
    if (line.match(/^[-*]\s+/)) {
      const listContent = line.replace(/^[-*]\s+/, '').trim();
      
      if (inCharacterList) {
        html += `<span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">${listContent}</span>`;
        continue;
      }
      
      if (inChoiceList) {
        const choiceMatch = listContent.match(/^Lựa chọn (\d+):\s*(.*?)(?:\s*\((.*?)\))?(?:\s*Shieldy:\s*(.*?))?$/);
        if (choiceMatch) {
          currentChoices.push({
            num: choiceMatch[1],
            text: choiceMatch[2],
            stats: choiceMatch[3] || '',
            shieldy: choiceMatch[4] || ''
          });
        } else {
          currentChoices.push({
            num: '',
            text: listContent,
            stats: '',
            shieldy: ''
          });
        }
        continue;
      }
    }
    
    // Văn bản thông thường khác
    closeLists();
    html += `<p class="text-xs md:text-sm font-bold text-slate-700 leading-relaxed my-2">${line}</p>`;
  }
  
  closeLists();
  if (inScene) {
    html += '</div>';
  }
  
  return html;
}

// Đọc và chuyển đổi kịch bản game (Visual Novel format)
function getScriptHtmlContent(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      let markdown = fs.readFileSync(filePath, 'utf-8');
      return parseScriptToVisualNovelHtml(markdown);
    }
    return `<div class="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">Không tìm thấy file: ${filePath}</div>`;
  } catch (err) {
    return `<div class="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">Lỗi khi đọc file kịch bản: ${err.message}</div>`;
  }
}

const htmlContent = {
  debai: getHtmlContent(paths.debai),
  proposal: getHtmlContent(paths.proposal),
  pho: getHtmlContent(paths.pho),
  pho3d: getHtmlContent(paths.pho3d),
  gdd: getHtmlContent(paths.gdd),
  ch1: getScriptHtmlContent(paths.ch1),
  ch2: getScriptHtmlContent(paths.ch2),
  ch3: getScriptHtmlContent(paths.ch3),
  ch4: getScriptHtmlContent(paths.ch4),
  ch5: getScriptHtmlContent(paths.ch5)
};

const template = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EchoShield Vietnam - Tài liệu Dự án & Kịch bản</title>
  <!-- Google Fonts: Be Vietnam Pro -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Mermaid.js for Rendering Diagrams -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Be Vietnam Pro', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Be Vietnam Pro base setup */
    :root {
      font-family: 'Be Vietnam Pro', sans-serif;
      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    html, body, button, input, select, textarea {
      font-family: 'Be Vietnam Pro', sans-serif !important;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      min-width: 320px;
      overflow-x: hidden;
      background-color: #f8fafc;
      color: #0f172a;
    }
    p, li, span, div, button, select, option {
      overflow-wrap: break-word;
      word-break: normal;
    }

    /* Page shell & Content Layout */
    .page-shell {
      width: min(100% - 48px, 1600px);
      margin-inline: auto;
      padding-block: 24px 32px;
    }
    .content-layout {
      display: grid;
      grid-template-columns: 340px minmax(0, 1fr);
      gap: 28px;
      align-items: start;
    }
    .main-panel {
      min-width: 0;
      border-radius: 18px;
      background: #ffffff;
      border: 1px solid #e4e9f2;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
      padding: 26px 28px 28px;
    }

    /* Header styling */
    .header-inner {
      width: min(100% - 48px, 1600px);
      min-height: 74px;
      margin-inline: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding-inline: 16px;
    }

    /* Sidebar styles */
    .sidebar-card {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid #e4e9f2;
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
    }
    .sidebar-menu-item {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      gap: 8px;
      align-items: center;
      min-height: 42px;
      padding: 10px 8px;
      border-radius: 10px;
      font-size: 13.5px;
      line-height: 1.3;
      font-weight: 700;
      transition: all 150ms ease;
      text-align: left;
    }
    .sidebar-menu-item svg {
      margin-top: 2.5px;
      flex-shrink: 0;
    }

    /* Script Header and Selector */
    .script-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
      gap: 24px;
      align-items: center;
    }
    .script-title {
      margin: 0;
      font-size: clamp(21px, 2.5vw, 27px);
      line-height: 1.25;
      letter-spacing: -0.03em;
      font-weight: 800;
      color: #0f172a;
    }
    .script-description {
      margin-top: 6px;
      font-size: 13px;
      line-height: 1.55;
      color: #64748b;
    }
    .chapter-control {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 12px;
    }
    .chapter-control label {
      font-size: 11px;
      line-height: 1.35;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #64748b;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .chapter-control select {
      width: 100%;
      min-width: 0;
      height: 44px;
      padding: 0 42px 0 14px;
      border-radius: 11px;
      border: 1px solid #dbe2ea;
      font-size: 13px;
      font-weight: 600;
      background-color: #ffffff;
      color: #0f172a;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: border-color 150ms ease;
    }
    .chapter-control select:focus-visible {
      border-color: #4f46e5;
    }

    /* Script Area */
    .script-surface {
      margin-top: 18px;
      background: #f8fafc;
      border: 1px solid #edf1f6;
      border-radius: 15px;
      padding: 24px 26px;
    }
    .script-scroll {
      max-height: clamp(460px, calc(100vh - 285px), 680px);
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      padding-right: 8px;
    }
    .script-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .script-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .script-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .script-scroll::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    .script-document {
      max-width: 820px;
      margin-inline: auto;
    }

    /* Prose styling */
    .prose h1 {
      font-weight: 800;
      color: #1e1b4b;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      font-size: 1.875rem;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
    .prose h2 {
      font-weight: 700;
      color: #312e81;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-size: 1.5rem;
    }
    .prose h3 {
      font-weight: 600;
      color: #4338ca;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }
    .prose p {
      margin-bottom: 1rem;
      line-height: 1.75;
      color: #334155;
    }
    .prose ul, .prose ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
      list-style-type: decimal;
    }
    .prose ul {
      list-style-type: disc;
    }
    .prose li {
      margin-bottom: 0.5rem;
      color: #334155;
    }
    pre, code, kbd, samp {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }
    .prose code {
      background-color: #f1f5f9;
      color: #b91c1c;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    .prose pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 1rem;
      border-radius: 0.75rem;
      overflow-x: auto;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
      line-height: 1.4;
      white-space: pre !important;
      word-break: normal !important;
      overflow-wrap: normal !important;
    }
    .prose pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
      white-space: pre !important;
      word-break: normal !important;
      overflow-wrap: normal !important;
    }
    .prose blockquote {
      border-left: 4px solid #4f46e5;
      padding-left: 1rem;
      color: #475569;
      font-style: italic;
      margin-bottom: 1rem;
      background-color: #f1f5f9;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border-radius: 0 0.5rem 0.5rem 0;
    }
    .prose table {
      display: block;
      width: 100%;
      overflow-x: auto;
      border-collapse: collapse;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 1.5rem;
    }
    .prose th, .prose td {
      border: 1px solid #cbd5e1;
      padding: 0.75rem;
      text-align: left;
      min-width: 120px;
    }
    
    /* Sửa lỗi hiển thị tab mobile */
    .tab-btn-m {
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      transition: all 150ms ease;
    }
    .prose th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }

    /* Script dialogue reader - Novel Style (Minimalist & Clean) */
    .script-dialogue {
      max-width: 800px;
      margin-inline: auto;
      background-color: #ffffff;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chapter-header-novel {
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
      padding-block: 16px;
      margin-block: 24px;
    }
    .novel-scene-block {
      border-bottom: 1px solid #e2e8f0;
      padding-block: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .novel-line {
      margin-block: 6px;
      line-height: 1.6;
    }
    .monologue-line {
      border-left: 3px solid #64748b;
      padding-left: 12px;
      background-color: #f8fafc;
      padding-block: 6px;
      border-radius: 0 8px 8px 0;
    }

    /* Mobile tabs layout */
    .mobile-tabs-container {
      display: none;
    }
    .mobile-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }
    .mobile-tabs::-webkit-scrollbar {
      display: none;
    }
    .mobile-tabs > * {
      flex: 0 0 auto;
      scroll-snap-align: start;
      white-space: nowrap;
    }

    /* Accessibility focus */
    :focus-visible {
      outline: 3px solid rgba(79, 70, 229, 0.22);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Responsive Tablet */
    @media (max-width: 1024px) {
      .page-shell {
        width: min(100% - 24px, 960px);
      }
      .content-layout {
        grid-template-columns: 200px minmax(0, 1fr);
        gap: 16px;
      }
      .main-panel {
        padding: 22px 20px;
      }
      .script-header {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .chapter-control {
        grid-template-columns: 110px minmax(0, 1fr);
      }
    }

    /* Responsive Mobile */
    @media (max-width: 768px) {
      .header-inner {
        min-height: auto;
        padding-block: 14px;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
      }
      .page-shell {
        width: 100%;
        padding: 14px 12px 24px;
      }
      .content-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .sidebar-desktop {
        display: none !important;
      }
      .mobile-tabs-container {
        display: block;
        margin-bottom: 4px;
      }
      .main-panel {
        padding: 18px 12px 20px;
        border-radius: 14px;
        overflow-x: hidden;
      }
      
      /* Novel Responsive Mobile Styles */
      .chapter-header-novel {
        padding-block: 12px !important;
        margin-block: 16px !important;
      }
      .chapter-header-novel h2 {
        font-size: 14px !important;
      }
      .novel-scene-block {
        padding-block: 14px !important;
        gap: 10px !important;
      }
      .novel-line {
        font-size: 13px !important;
        line-height: 1.5 !important;
      }
      .mobile-tabs {
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e1 transparent !important;
        padding-bottom: 12px !important;
      }
      .mobile-tabs::-webkit-scrollbar {
        display: block !important;
        height: 4px !important;
      }
      .mobile-tabs::-webkit-scrollbar-thumb {
        background-color: #cbd5e1 !important;
        border-radius: 10px !important;
      }
      .script-header {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
      }
      .chapter-control {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
      }
      .chapter-control select {
        width: 100%;
        font-size: 14px;
      }
      .script-scroll {
        max-height: none;
        overflow: visible;
        padding-right: 0;
      }
      .script-surface {
        padding: 18px 14px;
        border-radius: 12px;
      }
      .script-dialogue strong {
        display: block;
        margin-bottom: 2px;
      }
    }

    @media (max-width: 480px) {
      .brand-subtitle {
        display: none;
      }
      .script-title {
        font-size: 20px;
        line-height: 1.28;
      }
      .script-description {
        font-size: 12px;
      }
      .main-panel {
        padding-inline: 12px;
      }
      .script-surface {
        padding-inline: 12px;
      }
    }

    /* Footnote styles */
    .footnote-ref a {
      color: #4f46e5;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.8em;
      vertical-align: super;
      margin-left: 2px;
      padding: 1px 4px;
      border-radius: 4px;
      background-color: #e0e7ff;
      transition: all 150ms ease;
    }
    .footnote-ref a:hover {
      background-color: #c7d2fe;
      color: #3730a3;
    }
    .footnote-backref {
      color: #4f46e5;
      text-decoration: none;
      font-weight: bold;
      margin-right: 6px;
      font-size: 1.1em;
      transition: color 150ms ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #f1f5f9;
    }
    .footnote-backref:hover {
      background-color: #e2e8f0;
      color: #3730a3;
    }
    /* Sửa đổi style cho blockquote chứa footnote */
    .prose blockquote p {
      margin-bottom: 0;
    }
  </style>
</head>
<body class="font-sans antialiased min-h-screen flex flex-col">

  <!-- Premium Sticky Header (Bright theme, high contrast) -->
  <header class="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
    <div class="header-inner">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-indigo-50 border border-indigo-200 rounded-2xl">
          <i data-lucide="shield" class="w-6 h-6 text-indigo-600"></i>
        </div>
        <div>
          <h1 class="text-xl font-black tracking-wide text-slate-900 leading-none">ECHOSHIELD VIETNAM</h1>
          <p class="brand-subtitle text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">Trình Bày Dự Án & Kịch Bản 120 Phút</p>
        </div>
      </div>

      <!-- Quick action links removed (No live demo URL yet) -->
      <div></div>
    </div>
  </header>

  <!-- Main Grid Layout -->
  <div class="page-shell">
    <div class="content-layout">
      
      <!-- Left Navigation Menu (Desktop view) -->
      <aside class="sidebar-desktop flex flex-col gap-3 shrink-0">
        <div class="sidebar-card flex flex-col gap-1">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu Tài Liệu</h2>
          
          <button onclick="switchTab('debai')" id="btn-debai" class="tab-btn sidebar-menu-item w-full bg-indigo-600 text-white transition">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
            <span>1. Đề Bài UNESCO</span>
          </button>

          <button onclick="switchTab('proposal')" id="btn-proposal" class="tab-btn sidebar-menu-item w-full text-slate-600 hover:bg-slate-50 transition">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>2. Đề Án Chính Thức</span>
          </button>

          <button onclick="switchTab('pho')" id="btn-pho" class="tab-btn sidebar-menu-item w-full text-slate-600 hover:bg-slate-50 transition">
            <i data-lucide="utensils" class="w-4 h-4"></i>
            <span>3. Triết lý Phở Anh Hai</span>
          </button>

          <button onclick="switchTab('pho3d')" id="btn-pho3d" class="tab-btn sidebar-menu-item w-full text-slate-600 hover:bg-slate-50 transition">
            <i data-lucide="box" class="w-4 h-4"></i>
            <span>4. Kiến trúc Web3D Genshin</span>
          </button>

          <button onclick="switchTab('gdd')" id="btn-gdd" class="tab-btn sidebar-menu-item w-full text-slate-600 hover:bg-slate-50 transition">
            <i data-lucide="cpu" class="w-4 h-4"></i>
            <span>5. Kiến Trúc GDD</span>
          </button>

          <button onclick="switchTab('script')" id="btn-script" class="tab-btn sidebar-menu-item w-full text-slate-600 hover:bg-slate-50 transition">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>6. Kịch Bản 5 Chương</span>
          </button>
        </div>

        <!-- Quick statistics widget -->
        <div class="sidebar-card flex flex-col gap-3">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông Số Kịch Bản</h3>
          <div class="flex justify-between text-xs text-slate-600">
            <span>Tổng số phân cảnh:</span>
            <span class="font-bold text-slate-900">80 Scenes</span>
          </div>
          <div class="flex justify-between text-xs text-slate-600">
            <span>Thời lượng chơi:</span>
            <span class="font-bold text-slate-900">120 phút (2 tiếng)</span>
          </div>
          <div class="flex justify-between text-xs text-slate-600 gap-2">
            <span class="shrink-0">Đồng hành:</span>
            <span class="font-bold text-indigo-600 text-right">Shieldy (Spirit AI)</span>
          </div>
        </div>
      </aside>

      <!-- Main Content Reader View -->
      <main class="main-panel">
        
        <!-- Mobile horizontal tabs (visible only on mobile) -->
        <div class="mobile-tabs-container">
          <div class="mobile-tabs">
            <button onclick="switchTab('debai')" id="m-btn-debai" class="tab-btn-m px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Đề Bài</button>
            <button onclick="switchTab('proposal')" id="m-btn-proposal" class="tab-btn-m px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Proposal</button>
            <button onclick="switchTab('pho')" id="m-btn-pho" class="tab-btn-m px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Phở Triết Lý</button>
            <button onclick="switchTab('pho3d')" id="m-btn-pho3d" class="tab-btn-m px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Kiến Trúc Web3D</button>
            <button onclick="switchTab('gdd')" id="m-btn-gdd" class="tab-btn-m px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Kiến Trúc GDD</button>
            <button onclick="switchTab('script')" id="m-btn-script" class="tab-btn-m px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Kịch Bản 5 Chương</button>
          </div>
          
          <!-- Mobile Stats Card -->
          <div class="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>Tổng số phân cảnh: <span class="font-bold text-slate-900">80 Scenes</span></div>
            <div>Thời lượng chơi: <span class="font-bold text-slate-900">120 phút</span></div>
            <div class="col-span-2">Đồng hành: <span class="font-bold text-indigo-600">Shieldy (Spirit AI)</span></div>
          </div>
        </div>
        
        <!-- Tab 0: Debai -->
        <div id="tab-debai" class="tab-content prose max-w-none">
          ${htmlContent.debai}
        </div>

        <!-- Tab 1: Proposal -->
        <div id="tab-proposal" class="tab-content prose max-w-none hidden">
          ${htmlContent.proposal}
        </div>

        <!-- Tab 1.5: Pho Strategy & Spirit -->
        <div id="tab-pho" class="tab-content prose max-w-none hidden">
          ${htmlContent.pho}
        </div>

        <!-- Tab 1.7: Pho 3D -->
        <div id="tab-pho3d" class="tab-content prose max-w-none hidden">
          ${htmlContent.pho3d}
        </div>

        <!-- Tab 2: Technical GDD -->
        <div id="tab-gdd" class="tab-content prose max-w-none hidden">
          ${htmlContent.gdd}
        </div>

        <!-- Tab 3: Script Reader (Interactive sidebar inside tab) -->
        <div id="tab-script" class="tab-content hidden flex flex-col gap-6">
          <div class="border-b border-slate-100 pb-4">
            <div class="script-header">
              <div>
                <h2 class="script-title">Script Reader - Kịch Bản 80 Phân Cảnh</h2>
                <p class="script-description">Đọc thoại kịch tính chi tiết theo 5 Chương game.</p>
              </div>
              
              <!-- Chapter Selection Dropdown -->
              <div class="chapter-control">
                <label for="chapter-select">Chương:</label>
                <select id="chapter-select" onchange="loadChapter(this.value)">
                  <option value="ch1">Chương 1 - Mồi Lửa (Scene 001 - 016)</option>
                  <option value="ch2">Chương 2 - Sóng Ngầm (Scene 017 - 032)</option>
                  <option value="ch3">Chương 3 - Bóng Ma Deepfake (Scene 033 - 050)</option>
                  <option value="ch4">Chương 4 - Quyết Định (Scene 051 - 068)</option>
                  <option value="ch5">Chương 5 - Phán Quyết (Scene 069 - 080)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Script Content Display Area -->
          <div class="script-surface">
            <div class="script-scroll script-dialogue">
              <div class="script-document">
                <div id="script-ch1" class="chapter-content">${htmlContent.ch1}</div>
                <div id="script-ch2" class="chapter-content hidden">${htmlContent.ch2}</div>
                <div id="script-ch3" class="chapter-content hidden">${htmlContent.ch3}</div>
                <div id="script-ch4" class="chapter-content hidden">${htmlContent.ch4}</div>
                <div id="script-ch5" class="chapter-content hidden">${htmlContent.ch5}</div>
              </div>
            </div>
          </div>
        </div>

      </main>

    </div>
  </div>

  <!-- Footer -->
  <footer class="w-full border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-bold uppercase tracking-widest bg-white mt-auto">
    EchoShield Vietnam © 2026 - Phục vụ UNESCO Youth Hackathon 2026.
  </footer>

  <script>
    // Tab switching logic
    function switchTab(tabId) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      // Show active tab
      document.getElementById('tab-' + tabId).classList.remove('hidden');
      
      // Update sidebar buttons styling (Desktop)
      document.querySelectorAll('.sidebar-menu-item').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('text-slate-600', 'hover:bg-slate-50');
      });
      const activeBtn = document.getElementById('btn-' + tabId);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-600', 'hover:bg-slate-50');
        activeBtn.classList.add('bg-indigo-600', 'text-white');
      }

      // Update mobile tabs styling
      document.querySelectorAll('.tab-btn-m').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-600');
      });
      const activeBtnM = document.getElementById('m-btn-' + tabId);
      if (activeBtnM) {
        activeBtnM.classList.remove('bg-slate-100', 'text-slate-600');
        activeBtnM.classList.add('bg-indigo-600', 'text-white');
        // Scroll mobile tab into view
        activeBtnM.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // Script Reader chapter switching logic
    function loadChapter(chId) {
      document.querySelectorAll('.chapter-content').forEach(el => el.classList.add('hidden'));
      document.getElementById('script-' + chId).classList.remove('hidden');
    }

    // Convert code blocks with class language-mermaid to div class="mermaid"
    document.addEventListener("DOMContentLoaded", async function() {
      const mermaidBlocks = document.querySelectorAll('pre code.language-mermaid');
      mermaidBlocks.forEach(block => {
        const pre = block.parentElement;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = block.textContent;
        // Thêm các style để căn giữa và hiển thị đẹp
        div.style.background = '#ffffff';
        div.style.padding = '20px';
        div.style.borderRadius = '12px';
        div.style.border = '1px solid #e4e9f2';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.overflowX = 'auto';
        div.style.marginBottom = '1.25rem';
        pre.replaceWith(div);
      });
      
      // Khởi tạo mermaid với startOnLoad: false để chủ động render
      if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true
          }
        });
        
        // Gọi render tường minh sau khi DOM sẵn sàng
        try {
          await mermaid.run();
        } catch (err) {
          console.error("Mermaid run error:", err);
        }
      }
    });

    // Initialize Lucide Icons
    lucide.createIcons();
  </script>
</body>
</html>
`;

// Ghi file HTML
fs.writeFileSync(path.join(__dirname, 'index.html'), template, 'utf-8');
console.log('index.html has been successfully built at project root!');
