import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Random;

import ch.tune.*;


public class Production {
	public static final String rootPath = "D:/generatedTunes/";
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int repPerMode = 2;
		
		Calendar cal = Calendar.getInstance();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
	    
		String date = sdf.format(cal.getTime());
		
		ArrayList<TuneBase> tunes = new ArrayList<TuneBase>();
		
		tunes.add(new March2_4Simple());
		tunes.add(new March2_4Dotted1());
		tunes.add(new March2_4Dotted2());
		tunes.add(new March2_4Dotted3());
		tunes.add(new March2_4Dotted4());
		tunes.add(new March2_4DottedAll());
		tunes.add(new March3_4());
		tunes.add(new March4_4());
		
		tunes.add(new March6_8());
		tunes.add(new March9_8());
		tunes.add(new March12_8());
		
		tunes.add(new HornpipeSimple());
		tunes.add(new HornpipeDotted1());
		tunes.add(new HornpipeDotted2());
		tunes.add(new HornpipeDotted3());
		tunes.add(new HornpipeDotted4());
		tunes.add(new HornpipeDotted5());
		tunes.add(new HornpipeDotted6());
		tunes.add(new HornpipeDottedAll());
		tunes.add(new Waltz());
		tunes.add(new Strathspey());
		
		tunes.add(new Jig6_8());
		tunes.add(new Jig9_8());
		tunes.add(new Jig12_8());
		
		tunes.add(new ReelSimple());
		tunes.add(new ReelDotted1());
		tunes.add(new ReelDotted2());
		tunes.add(new ReelDotted3());
		tunes.add(new ReelDotted4());
		tunes.add(new ReelDotted5());
		tunes.add(new ReelDotted6());
		tunes.add(new ReelDottedAll());
		
		
		for(TuneBase tune: tunes){
			ArrayList<Integer> forms = new ArrayList<Integer>();
			int percent = 0;
			forms.add(percent);
			for(int i=0; i<tune.getUsedForms().length; i++){
				percent += tune.getUsedFormsOccurence()[i];
				forms.add(percent);
			}
			for(int i=0; i<19; i++){
				ArrayList<String> notes = new ArrayList<String>();
				if(!tune.modes.containsKey(i)){
					continue;
				}
				for(int z=0; z<tune.modes.get(i).length; z++){
					int noteType = tune.modes.get(i)[z];
					int repeat=0;
					if(noteType==2){
						repeat = 3;
					}else if(noteType==1){
						repeat = 1;
					}
					for(int e=0; e<repeat; e++){
						notes.add(tune.tones[z]);
					}
				}
				for(int o=0; o<repPerMode; o++){
					toFile(i, tune, generateABC(tune, forms, notes), date);
					tune.tuneNumber++;
				}
			}
		}
		System.out.println("Finished");
	}

	
	private static String generateABC(TuneBase tune, ArrayList<Integer> forms, ArrayList<String> notes) {
		String[] phrases = new String[4];
		Random rn = new Random(System.currentTimeMillis());
		int barsPerPhrase = 2;
		
		for(int i=0; i<4; i++){
			if(phrases[i]==null){
				phrases[i]="";
			}
			for(int o=0; o<barsPerPhrase; o++){
				for(int p=0; p<tune.getNumberOfForms(); p++){
					int form = rn.nextInt(forms.get(forms.size()-1)+1);
					int usedForm = 0;
					for(int q=0; q<forms.size();q++){
						if(form>=forms.get(q) && form<=forms.get(q+1)){
							usedForm=q;
							break;
						}
					}
					for(String formPart: tune.getUsedForms()[usedForm]){
						String note=notes.get(rn.nextInt(notes.size()));
						phrases[i]+=note+formPart+"";
					}
					phrases[i]+=" ";
				}
				if(!(i==3 && o==barsPerPhrase-1)){
					phrases[i]+="| ";
				}
			}
		}
		
		String part1 = (tune.doRepeatParts() ? "|:" : "[|" )+phrases[0]+phrases[2]+"\n"+phrases[0]+phrases[3]+(tune.doRepeatParts() ? ":|" : "|]" );
		String part2 = (tune.doRepeatParts() ? "|:" : "[|" )+phrases[1]+phrases[2]+"\n"+phrases[1]+phrases[3]+(tune.doRepeatParts() ? ":|" : "|]" );
		
		return part1+"\n"+part2;
	}


	private static void toFile(final int repetition, final TuneBase tune, final String abc, final String date){
		String path = rootPath+date+"/";
		File rootFile = new File(rootPath);
		if(!rootFile.exists()){
			rootFile.mkdir();
		}
		File dir = new File(path);
		if(!dir.exists()){
			dir.mkdir();
		}
		String header = (tune.tuneNumber>1 ? "\n\n" : "") + "X: "+
						tune.tuneNumber+"\nT: "+tune.getTitle(repetition)+
						"\nC: Christoph Schuetz\nR: "+tune.getRhytm()+
						"\nM: "+tune.getMeasure()+"\nK: HP"+
						"\nL: "+tune.getNominalLength()+
						"\nQ: "+tune.getTempo();
		BufferedWriter f;
		try {
			f = new BufferedWriter(new FileWriter(new File(path+tune.getName()+".abc"), true));
			f.write(header+"\n"+abc);
			f.flush();
			f.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}