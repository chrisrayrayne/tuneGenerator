package ch.tune;

public class March2_4Dotted2 extends March2_4 {

	String[][] forms = {{""}, {"/", "/"}, {"/>", "/"}, {"/<", "/"}, {"/4<", "/4", "/4<", "/4"}};
	int[] occurence = {10, 20, 30, 15, 25};
	
	@Override
	public String getName(){
		return super.getName()+"-Dotted2";
	}
	
	@Override
	public String[][] getUsedForms() {
		return forms;
	}

	@Override
	public int[] getUsedFormsOccurence() {
		return occurence;
	}

	@Override
	public int getNumberOfForms() {
		return 2;
	}

	@Override
	public String getNominalLength() {
		return "1/4";
	}

}
