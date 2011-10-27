(function(editor, document) {
	editor.beginUndoAction();
	
	try {
		var contents = editor.text.trim();
		var lineEnding = contents.indexOf('\r\n') < 0 ? (contents.indexOf('\r') < 0 ? '\n' : '\r') : '\r\n';
		
		var lines = contents.split(/\n/);
		
		if (lines[0].indexOf('ModPlug Tracker MPT') < 0) return;
		
		var _notesMap = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
		
		var parseNote = function(noteString) {
			noteString = noteString.trim();
			if (!noteString) return undefined;
			
			switch (noteString) {
				case '===': return -1; // note off
				case '^^^': return -2; // note cut
			}
			
			var octave = noteString.charAt(2);
			if (octave < '0' || octave > '9') return undefined;
			octave = parseInt(octave, 10);
			
			return octave * 12 + _notesMap.indexOf(noteString.substr(0, 2));
		};
		
		var parseVolume = function(volumeString, o) {
			volumeString = volumeString.trim();
			if (!volumeString) return;
			
			var value = parseInt(volumeString.substr(1, 2), 10);
			if (isNaN(value)) return;
			
			switch (volumeString.charAt(0)) {
				case 'v':
					o.volume = value;
					break;
				case 'e':
					o.bend = -value;
					break;
				case 'f':
					o.bend = value;
					break;
			}
		};
		
		lines.splice(0, 1);
		
		var noteData = lines.map(function(line) {
			var channels = line.split('|');
			var data = [];
			
			for (var i = 0; i < channels.length; i++) {
				var channel = channels[i];
				
				var o = {};
				
				var note = parseNote(channel.substr(0, 3));
				var volume = parseVolume(channel.substr(5, 3), o);
				var instrument = channel.substr(3, 2);
				instrument = instrument === '..' ? '' : parseInt(instrument, 10);
				
				if (note) {
					o.note = note;
					// Only include instruments if we have note data as well
					if (instrument !== '' && !isNaN(instrument)) o.instrument = instrument;
				}
				
				if (o.note || o.velocity || o.bend || o.instrument) data.push(o);
			}
			
			return data;
		});
		
		var name = document.baseName;
		name = name.substr(0, name.lastIndexOf('-'));
		
		var json = JSON.stringify({
			name: name,
			rows: noteData
		}, undefined, '\t');
		
		// Add an extra two tabs after each line
		lineEnding = lineEnding + '\t\t';
		
		var prefix = '',
				suffix = ', ';
		
		editor.text = prefix + json.replace(/\n/g, lineEnding) + suffix;
		
		editor.selectAll();
		editor.copy();
		
	} catch (ex) {
		alert('EXCEPTION:\n' + ex);
	}
	
	editor.endUndoAction();
	
})(ko.views.manager.currentView.scimoz, ko.views.manager.currentView.koDoc);