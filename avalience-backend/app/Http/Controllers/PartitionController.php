<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use League\Csv\Reader;


class PartitionController extends Controller {
    
    function part(Request $request) {
        $agentsfile = $request->file('agentsfile');
        
        $agentsReader = Reader::createFromFileObject($agentsfile->openFile());
        $agentsReader->setDelimiter(',');
        $agentsReader->setHeaderOffset(0);


        $agPartition=array();

        foreach($agentsReader as $record) {
            if(strcmp($record['Status'], 'Busy') == 0) {
                continue;
            }
            $w = $record['Weight'];
            while($w--) {
                $agPartition[] = $record['Name'];
            }
        }

        $leadsfile = $request->file('leadsfile');
        $leadsReader = Reader::createFromFileObject($leadsfile->openFile());
        $leadsReader->setDelimiter(',');
        $leadsReader->setHeaderOffset(0);

        $out = array();
        $agCounter = 0;
        $agSize = count($agPartition);
        foreach($leadsReader as $record) {
            $agent = $agPartition[$agCounter++%$agSize];
            $out[] = array(
                'lead_name' => $record['Name'],
                'lead_email' => $record['Email'],
                'assigned_agent' => $agent
            );
        }

        return $out;

    }

}
